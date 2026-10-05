"""Generate a branded cover image and an SEO content file for every product.

Input:  scripts/data/products-live.json  (refresh with scripts/fetch-products.py)
Output: frontend/dist/uploads/products/{slug}.jpg          1200x1200 product image
        frontend/dist/uploads/products/thumb/{slug}.jpg    600x600 listing image
        frontend/dist/assets/seo/products/{slug}.json      SEO title, meta, body sections, FAQ
"""
from __future__ import annotations

import json
import math
import os
import re
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA = os.path.join(ROOT, "scripts", "data", "products-live.json")
IMG_DIR = os.path.join(ROOT, "frontend", "dist", "uploads", "products")
THUMB_DIR = os.path.join(IMG_DIR, "thumb")
SEO_DIR = os.path.join(ROOT, "frontend", "dist", "assets", "seo", "products")
FONT_DIR = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts")
SITE = "https://shop.hedztech.com"


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    for candidate in (name, "segoeuib.ttf", "arialbd.ttf"):
        path = os.path.join(FONT_DIR, candidate)
        if os.path.isfile(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def clean(text: str | None) -> str:
    s = str(text or "")
    s = s.replace("\ufffd", "-").replace("\u2014", "-").replace("\u2013", "-")
    s = re.sub(r"\?{2,}", "-", s)
    s = re.sub(r"\s+", " ", s).strip(" -")
    return s


def money(n) -> str:
    return "Rs. " + f"{int(round(float(n or 0))):,}"


# --------------------------------------------------------------------------- families

FAMILIES: dict[str, dict] = {
    "windows": dict(
        noun="Windows license key", glyph="monitor", color=((14, 116, 220), (8, 47, 120)),
        about="{name} activates a genuine copy of Microsoft Windows so you get every security update, BitLocker and Remote Desktop (Pro editions), and no \"Activate Windows\" watermark.",
        features=["Genuine Microsoft activation through Windows Settings", "Monthly security and feature updates from Windows Update", "Works with a clean install or an upgrade of an existing PC", "Supports English and other display language packs", "Removes the activation watermark and unlocks personalisation"],
        req=["64-bit processor 1 GHz or faster (Windows 11 needs a supported CPU with TPM 2.0 and Secure Boot)", "4 GB RAM (8 GB recommended)", "64 GB free storage", "Internet connection for activation"],
        topic="Windows",
    ),
    "win_ent": dict(
        noun="Windows Enterprise volume key", glyph="monitor", color=((30, 64, 175), (15, 23, 42)),
        about="{name} is a Microsoft volume (MAK) licence for offices, labs and businesses that need the long-term-servicing Enterprise edition on several machines with one key.",
        features=["One MAK key activates multiple PCs up to the stated count", "Enterprise security: BitLocker, AppLocker, Credential Guard", "LTSC/LTSB builds skip feature updates for maximum stability", "Ideal for kiosks, POS terminals, labs and office fleets", "Activation by command line or Settings"],
        req=["64-bit processor 1 GHz or faster", "2 GB RAM (4 GB+ recommended)", "32 GB free storage", "Enterprise or LTSC installation media matching the key"],
        topic="Windows Enterprise",
    ),
    "server": dict(
        noun="Windows Server license key", glyph="server", color=((51, 65, 85), (15, 23, 42)),
        about="{name} licenses Microsoft Windows Server for file sharing, Active Directory, Hyper-V virtualisation and business applications on your own hardware.",
        features=["Active Directory, DNS, DHCP and file-server roles", "Hyper-V virtualisation (Datacenter allows unlimited VMs)", "Windows Admin Center and PowerShell management", "Long-term support security updates", "Retail key activated from Server settings or slmgr"],
        req=["64-bit processor 1.4 GHz or faster", "2 GB RAM (more for Desktop Experience)", "32 GB free storage", "Matching Standard or Datacenter installation media"],
        topic="Windows Server",
    ),
    "rds": dict(
        noun="Remote Desktop Services CAL pack", glyph="server", color=((71, 85, 105), (30, 41, 59)),
        about="{name} adds Remote Desktop Services client access licences so multiple users or devices can connect to your Windows Server session host at the same time.",
        features=["50 concurrent RDS client access licences", "Per User or Per Device CAL mode", "Installed through RD Licensing Manager", "Removes the 120-day RDS grace-period limit", "Works with on-premise session hosts"],
        req=["Windows Server of the matching version with the RD Licensing role", "Remote Desktop Session Host configured", "Administrator access to the server"],
        topic="Windows Server RDS",
    ),
    "sql": dict(
        noun="SQL Server license key", glyph="database", color=((185, 28, 28), (69, 10, 10)),
        about="{name} is a Microsoft SQL Server licence for running production databases, reporting and business applications on Windows.",
        features=["Relational database engine with T-SQL", "SQL Server Management Studio support", "Backup, restore and high-availability features", "Reporting and Integration Services (edition dependent)", "Product key entered during setup"],
        req=["Windows Server or Windows 10/11 64-bit", "4 GB RAM minimum", "6 GB free storage", "x64 processor 1.4 GHz or faster"],
        topic="SQL Server",
    ),
    "office": dict(
        noun="Microsoft Office license", glyph="document", color=((234, 88, 12), (124, 45, 18)),
        about="{name} gives you the classic desktop Office apps - Word, Excel, PowerPoint and more - with a one-time licence, so there is no monthly subscription to renew.",
        features=["Word, Excel and PowerPoint desktop apps", "Outlook, Access and Publisher included in Professional Plus", "Works offline once activated", "Saves in standard .docx, .xlsx and .pptx formats", "Security updates through Microsoft Update"],
        req=["Windows 10 or Windows 11 (Mac editions need a supported macOS)", "4 GB RAM", "4 GB free storage", "Internet connection for activation"],
        topic="Microsoft Office",
    ),
    "m365": dict(
        noun="Microsoft 365 / Office 365 subscription", glyph="cloud", color=((14, 165, 233), (12, 74, 110)),
        about="{name} gives you the always-updated Microsoft 365 apps with OneDrive cloud storage, so your documents are available on PC, Mac, tablet and phone.",
        features=["Latest Word, Excel, PowerPoint and Outlook", "OneDrive cloud storage for files and backups", "Install on PC, Mac, iPhone and Android", "Real-time co-authoring and sharing", "New features delivered automatically"],
        req=["Windows 10/11 or a recent macOS", "4 GB RAM", "Microsoft account or the provided work account", "Internet connection"],
        topic="Microsoft 365",
    ),
    "project": dict(
        noun="Microsoft Project license", glyph="chart", color=((22, 163, 74), (20, 83, 45)),
        about="{name} is Microsoft's project-management desktop app for planning schedules, Gantt charts, resources and budgets.",
        features=["Gantt charts and timeline views", "Resource and cost management", "Critical-path and baseline tracking", "Reports and dashboards", "Import and export with Excel"],
        req=["Windows 10 or Windows 11", "4 GB RAM", "4 GB free storage", "Not compatible with Mac"],
        topic="Microsoft Project",
    ),
    "visio": dict(
        noun="Microsoft Visio license", glyph="diagram", color=((124, 58, 237), (59, 7, 100)),
        about="{name} is Microsoft's diagramming app for flowcharts, network diagrams, floor plans and org charts.",
        features=["Hundreds of professional templates and stencils", "Flowcharts, network, floor plan and org charts", "Data-linked diagrams from Excel", "Export to PDF, PNG and SVG", "Collaborate with Office files"],
        req=["Windows 10 or Windows 11", "4 GB RAM", "4 GB free storage", "Not compatible with Mac"],
        topic="Microsoft Visio",
    ),
    "access": dict(
        noun="Microsoft Access license", glyph="database", color=((153, 27, 27), (69, 10, 10)),
        about="{name} is Microsoft's desktop database app for building custom business databases, forms and reports without a server.",
        features=["Tables, queries, forms and reports", "Templates for inventory, contacts and assets", "Connects to SQL Server and Excel", "VBA macros and automation", "Runs fully on your PC"],
        req=["Windows 10 or Windows 11", "4 GB RAM", "4 GB free storage", "Not compatible with Mac"],
        topic="Microsoft Access",
    ),
    "powerbi": dict(
        noun="Power BI account", glyph="chart", color=((202, 138, 4), (113, 63, 18)),
        about="{name} gives you Microsoft Power BI for turning Excel sheets, databases and online sources into interactive dashboards and reports.",
        features=["Interactive dashboards and visual reports", "Connects to Excel, SQL and hundreds of sources", "Power Query data cleaning", "DAX measures and data models", "Share reports online (Pro)"],
        req=["Windows 10/11 for Power BI Desktop", "Modern web browser for the Power BI service", "Internet connection"],
        topic="Power BI",
    ),
    "vmware": dict(
        noun="VMware license key", glyph="layers", color=((71, 85, 105), (30, 41, 59)),
        about="{name} lets you run Windows, Linux and other operating systems as virtual machines on one computer for testing, development and training.",
        features=["Run multiple operating systems side by side", "Snapshots and clones for safe testing", "Shared folders and drag-and-drop", "3D graphics and USB device support", "Lifetime key for the stated major version"],
        req=["64-bit CPU with virtualisation (VT-x/AMD-V)", "8 GB RAM recommended", "1.2 GB+ storage plus space for VMs"],
        topic="VMware",
    ),
    "parallels": dict(
        noun="Parallels Desktop license", glyph="layers", color=((220, 38, 38), (127, 29, 29)),
        about="{name} runs Windows apps on a Mac - including Apple silicon M1/M2/M3 Macs - without restarting.",
        features=["Run Windows 11 on Apple silicon and Intel Macs", "Coherence mode for Windows apps on the Mac desktop", "Shared clipboard, folders and printers", "Optimised graphics for apps and games", "Lifelong key for the stated version"],
        req=["Mac with Apple silicon or Intel processor", "Supported macOS version", "8 GB RAM recommended", "Free disk space for Windows"],
        topic="Parallels Desktop",
    ),
    "autodesk": dict(
        noun="Autodesk subscription", glyph="cube", color=((8, 145, 178), (22, 78, 99)),
        about="{name} gives you access to Autodesk design software such as AutoCAD, Revit, 3ds Max, Maya and Civil 3D for architecture, engineering and 3D work.",
        features=["Official Autodesk downloads and updates", "AutoCAD, Revit, 3ds Max, Maya and more (by plan)", "Sign in with an Autodesk ID", "Cloud storage and collaboration tools", "Valid for the stated subscription term"],
        req=["Windows 10/11 64-bit (some apps also on macOS)", "16 GB RAM recommended", "DirectX 11/12 capable graphics card", "Internet connection for sign-in"],
        topic="Autodesk",
    ),
    "cad3d": dict(
        noun="3D design and rendering software", glyph="cube", color=((15, 118, 110), (19, 78, 74)),
        about="{name} is professional software for architects, interior designers and 3D artists to model, render and present projects.",
        features=["Professional 3D modelling and rendering", "Photo-realistic visualisation", "Works with common CAD and 3D formats", "Official updates for the licence term", "Sign-in or key based activation"],
        req=["Windows 10/11 64-bit (some products also support macOS)", "16 GB RAM recommended", "Dedicated graphics card recommended", "Internet connection for activation"],
        topic="3D design software",
    ),
    "adobe": dict(
        noun="Adobe software", glyph="pen", color=((219, 39, 119), (112, 26, 117)),
        about="{name} gives you Adobe's professional creative tools for photo editing, design, video and PDF work.",
        features=["Official Adobe apps and updates", "Photoshop, Illustrator, Premiere Pro, Acrobat and more (by plan)", "Cloud libraries and fonts (Creative Cloud plans)", "Works on Windows and macOS", "Valid for the stated term"],
        req=["Windows 10/11 64-bit or a supported macOS", "8 GB RAM (16 GB recommended for video)", "GPU with DirectX 12 / Metal support", "Internet connection for sign-in"],
        topic="Adobe",
    ),
    "pdf": dict(
        noun="PDF editor license", glyph="pdf", color=((220, 38, 38), (127, 29, 29)),
        about="{name} lets you create, edit, convert, sign and protect PDF documents on your computer.",
        features=["Edit text and images inside PDFs", "Convert PDF to Word, Excel and PowerPoint", "Combine, split and organise pages", "Fill forms and add e-signatures", "Password protection and redaction"],
        req=["Windows 10/11 (Mac editions need a supported macOS)", "4 GB RAM", "2 GB free storage"],
        topic="PDF software",
    ),
    "corel": dict(
        noun="CorelDRAW license", glyph="pen", color=((22, 163, 74), (20, 83, 45)),
        about="{name} is a professional vector graphics suite for logos, print layouts, signage and illustration.",
        features=["Vector illustration and page layout", "Photo-PAINT image editing", "Font management and typography tools", "Export for print, web and cutting machines", "Lifetime licence for the stated version"],
        req=["Windows 10/11 64-bit (PC/Mac editions also support macOS)", "8 GB RAM", "5.5 GB free storage", "1280 x 720 display"],
        topic="CorelDRAW",
    ),
    "canva": dict(
        noun="Canva account", glyph="pen", color=((0, 168, 186), (21, 94, 117)),
        about="{name} unlocks Canva's premium templates, Brand Kit, background remover and stock library for social posts, presentations and marketing designs.",
        features=["Millions of premium templates, photos and elements", "Background remover and Magic Resize", "Brand Kit for logos, colours and fonts", "Team folders and sharing", "Works in browser, desktop and mobile apps"],
        req=["Modern web browser or the Canva app", "Internet connection"],
        topic="Canva",
    ),
    "invideo": dict(
        noun="InVideo subscription", glyph="play", color=((79, 70, 229), (49, 46, 129)),
        about="{name} upgrades your own InVideo account for AI video creation, templates and stock media for YouTube, ads and social media.",
        features=["AI script-to-video generation", "Premium templates and stock footage", "Remove InVideo watermark", "HD/4K exports (by plan)", "Activated on your own account"],
        req=["Modern web browser", "InVideo account email", "Internet connection"],
        topic="InVideo",
    ),
    "maxon": dict(
        noun="Maxon One subscription", glyph="cube", color=((30, 64, 175), (23, 37, 84)),
        about="{name} includes Cinema 4D, Redshift and Red Giant tools for motion graphics, 3D animation and visual effects.",
        features=["Cinema 4D 3D modelling and animation", "Redshift GPU renderer", "Red Giant VFX and motion tools", "Official updates for the term", "Maxon App sign-in"],
        req=["Windows 10/11 64-bit or supported macOS", "16 GB RAM recommended", "GPU with recent drivers"],
        topic="Maxon Cinema 4D",
    ),
    "grammarly": dict(
        noun="Grammarly Premium", glyph="document", color=((21, 128, 61), (20, 83, 45)),
        about="{name} upgrades your writing with advanced grammar, clarity, tone and plagiarism checks in your browser, Word and email.",
        features=["Advanced grammar and punctuation checks", "Clarity and tone suggestions", "Plagiarism checker", "Works in browser, Word and desktop app", "Valid for the stated term"],
        req=["Chrome, Edge, Firefox or Safari", "Windows or macOS desktop app optional", "Internet connection"],
        topic="Grammarly",
    ),
    "ai": dict(
        noun="AI subscription", glyph="spark", color=((16, 163, 127), (6, 78, 59)),
        about="{name} gives you premium access to ChatGPT with faster responses and the latest models for writing, coding and research.",
        features=["Access to advanced GPT models", "Faster responses at busy times", "File uploads, image and data analysis", "Works on web, Windows, Mac and mobile", "Valid for the stated term"],
        req=["Modern web browser or ChatGPT app", "Internet connection"],
        topic="ChatGPT",
    ),
    "streaming": dict(
        noun="streaming subscription", glyph="play", color=((185, 28, 28), (69, 10, 10)),
        about="{name} gives you ad-free premium streaming on your TV, phone and laptop for the stated period.",
        features=["Premium ad-free streaming", "HD/Ultra HD quality where supported", "Works on smart TV, mobile and web", "Download for offline viewing or listening (by service)", "Valid for the stated period"],
        req=["Smart TV, phone, tablet or computer", "Stable internet connection"],
        topic="streaming",
    ),
    "linkedin": dict(
        noun="LinkedIn Premium subscription", glyph="briefcase", color=((10, 102, 194), (12, 74, 110)),
        about="{name} upgrades LinkedIn with InMail credits, profile insights and LinkedIn Learning for job seekers and business professionals.",
        features=["InMail messages to recruiters and prospects", "See who viewed your profile", "LinkedIn Learning courses", "Applicant and company insights", "Valid for the stated term"],
        req=["LinkedIn account", "Web browser or LinkedIn app"],
        topic="LinkedIn Premium",
    ),
    "cloud": dict(
        noun="cloud storage plan", glyph="cloud", color=((37, 99, 235), (30, 58, 138)),
        about="{name} adds extra Google Drive storage so you can back up photos, documents and phone data in the cloud.",
        features=["Extra Google Drive cloud storage", "Back up phone photos and files", "Share files and folders with links", "Access from any device", "Works with Gmail and Google Photos"],
        req=["Google account", "Web browser or Google Drive app"],
        topic="Google Drive",
    ),
    "accounting": dict(
        noun="QuickBooks license", glyph="calc", color=((22, 163, 74), (20, 83, 45)),
        about="{name} is desktop accounting software for invoicing, payroll, inventory and financial reports.",
        features=["Invoicing, bills and expense tracking", "Inventory and job costing", "Financial reports and statements", "Multi-user support (Enterprise)", "Lifetime licence for the stated version"],
        req=["Windows 10/11 (Mac edition needs a supported macOS)", "8 GB RAM recommended", "2.5 GB free storage"],
        topic="QuickBooks",
    ),
    "antivirus": dict(
        noun="antivirus license", glyph="shield", color=((22, 163, 74), (20, 83, 45)),
        about="{name} protects your computer from viruses, ransomware, phishing websites and online banking fraud.",
        features=["Real-time virus and malware protection", "Ransomware and phishing protection", "Safe banking and browsing", "Firewall and web protection (Total Security)", "Automatic virus definition updates"],
        req=["Windows 10/11 (some products also cover Mac and Android)", "2 GB RAM", "1.5 GB free storage", "Internet connection for updates"],
        topic="antivirus",
    ),
    "utility": dict(
        noun="PC utility license", glyph="wrench", color=((71, 85, 105), (30, 41, 59)),
        about="{name} helps you keep your computer fast, organised and safe - from cleaning and partitioning to backups and downloads.",
        features=["Official licence key for full features", "Simple setup on Windows", "Safe, reversible operations", "Free updates for the licence term", "Ideal for home users and technicians"],
        req=["Windows 10/11 (Mac editions where stated)", "2 GB RAM", "500 MB free storage"],
        topic="PC utility",
    ),
    "pro": dict(
        noun="professional software license", glyph="chart", color=((67, 56, 202), (30, 27, 75)),
        about="{name} is specialised professional software used by students, researchers, engineers and businesses.",
        features=["Official full-feature licence", "Official download and installation", "Used by universities and professionals", "Activation support from our team", "Valid for the stated term"],
        req=["Windows 10/11 64-bit (Mac where stated)", "8 GB RAM recommended", "Internet connection for activation"],
        topic="professional software",
    ),
    "install": dict(
        noun="remote installation service", glyph="wrench", color=((217, 119, 6), (120, 53, 15)),
        about="{name} is a remote setup service: our technician installs and configures the software on your computer over AnyDesk or TeamViewer.",
        features=["Remote installation by a technician", "Full working setup on your PC or Mac", "Configured and tested before we finish", "Help with common errors", "Booked at a time that suits you"],
        req=["Windows or Mac computer with internet", "AnyDesk or TeamViewer installed", "Enough free disk space for the software"],
        topic="software installation",
    ),
    "generic": dict(
        noun="software license", glyph="key", color=((29, 78, 216), (30, 58, 138)),
        about="{name} is a genuine software licence delivered digitally by Nepal TechGuard.",
        features=["Genuine licence", "Fast digital delivery", "Activation support", "Secure checkout", "Support from Kathmandu"],
        req=["Compatible Windows or Mac computer", "Internet connection for activation"],
        topic="software",
    ),
}

CAD_WORDS = ("sketchup", "v-ray", "vray", "corona", "enscape", "rhino", "lumion", "archicad", "bluebeam", "smartdraw")
PRO_WORDS = ("spss", "matlab", "tableau", "endnote", "jetbrains", "zebra")


def family_of(p: dict) -> str:
    n = p["name"].lower()
    c = p["category_slug"]
    if c == "installation-services" or "installation" in n:
        return "install"
    if "rds" in n and "cal" in n:
        return "rds"
    if "sql server" in n:
        return "sql"
    if re.search(r"\bserver\b", n) and "partition" not in n and "macrorit" not in n and "aomei" not in n:
        return "server"
    if "windows" in n and re.search(r"enterprise|ltsc|ltsb", n):
        return "win_ent"
    if "windows" in n:
        return "windows"
    if "project" in n:
        return "project"
    if "visio" in n:
        return "visio"
    if re.match(r"access\b", n):
        return "access"
    if "365" in n or c == "microsoft-365-office-365":
        return "m365"
    if "office" in n:
        return "office"
    if "power bi" in n:
        return "powerbi"
    if "vmware" in n:
        return "vmware"
    if "parallel" in n:
        return "parallels"
    if "autodesk" in n or "auto desk" in n:
        return "autodesk"
    if any(w in n for w in CAD_WORDS):
        return "cad3d"
    if "acrobat" in n or "nitro" in n:
        return "pdf"
    if "adobe" in n:
        return "adobe"
    if "corel" in n:
        return "corel"
    if "canva" in n:
        return "canva"
    if "invideo" in n:
        return "invideo"
    if "maxon" in n:
        return "maxon"
    if "grammarly" in n:
        return "grammarly"
    if "chatgpt" in n:
        return "ai"
    if any(w in n for w in ("netflix", "spotify", "youtube")):
        return "streaming"
    if "linkedin" in n:
        return "linkedin"
    if "google drive" in n or c == "cloud-storage":
        return "cloud"
    if "quickbook" in n:
        return "accounting"
    if c in ("antivirus", "antivirus-security") or re.search(r"security|antivirus|bitdefender|quick heal|k7", n):
        return "antivirus"
    if c == "utility-software" or re.search(r"ccleaner|partition|acronis|download manager", n):
        return "utility"
    if any(w in n for w in PRO_WORDS) or c == "other":
        return "pro"
    return "generic"


# --------------------------------------------------------------------------- attributes

def attributes(p: dict) -> dict:
    n = p["name"]
    nl = n.lower()
    sd = clean(p.get("short_description")).lower()
    hay = nl + " " + sd
    a: dict = {}
    m = re.search(r"(\d+)\s*(pc|pcs|device|devices|users?|seats?|screens?)\b", hay)
    if m:
        unit = m.group(2)
        num = int(m.group(1))
        if unit.startswith("pc"):
            a["devices"] = f"{num} PC" + ("s" if num > 1 else "")
        elif unit.startswith("device"):
            a["devices"] = f"{num} device" + ("s" if num > 1 else "")
        elif unit.startswith("user"):
            a["devices"] = f"{num} user" + ("s" if num > 1 else "")
        elif unit.startswith("seat"):
            a["devices"] = f"{num} seats"
        else:
            a["devices"] = f"{num} screen" + ("s" if num > 1 else "")
    m = re.search(r"(\d+)\s*(year|years|yr|month|months|days)\b(?!\s*warranty)", nl)
    if re.search(r"lifetime|lifelong", hay):
        a["term"] = "Lifetime"
    elif m:
        num, unit = int(m.group(1)), m.group(2)
        if unit.startswith("y"):
            a["term"] = f"{num} year" + ("s" if num > 1 else "")
        elif unit.startswith("m"):
            a["term"] = f"{num} month" + ("s" if num > 1 else "")
        else:
            a["term"] = f"{num} days"
    elif re.search(r"\b1year\b|\b1y\b", nl):
        a["term"] = "1 year"
    if re.search(r"pc\s*/\s*mac|win\s*/\s*mac|mac and windows|win/mac|pc/mac", hay):
        a["platform"] = "Windows & Mac"
    elif re.search(r"\bmac\b", nl):
        a["platform"] = "Mac"
    elif re.search(r"windows|\bwin\b|\bpc\b", nl):
        a["platform"] = "Windows"
    if "bind" in nl:
        a["license"] = "Bind account"
    elif "mak" in nl:
        a["license"] = "MAK volume key"
    elif "phone key" in nl:
        a["license"] = "Phone activation"
    elif "oem" in nl:
        a["license"] = "OEM key"
    elif "retail" in nl:
        a["license"] = "Retail key"
    elif re.search(r"own id|own account|user id|extend|in user own", nl):
        a["license"] = "Your own account"
    elif re.search(r"account|admin|password|private", nl):
        a["license"] = "Account login"
    elif "preactivated" in nl:
        a["license"] = "Pre-activated"
    if re.search(r"\bedu\b|education|student", nl):
        a["edu"] = True
    m = re.search(r"(\d+)\s*days?\s*warranty|(\d+)\s*days\b", sd)
    if m:
        a["warranty"] = f"{m.group(1) or m.group(2)} days"
    m = re.search(r"\b(20\d\d|19\d\d)\b", n)
    if m:
        a["year"] = m.group(1)
    return a


def delivery_mode(fam: str, a: dict, p: dict) -> str:
    nl = p["name"].lower()
    if fam == "install":
        return "install"
    if a.get("license") == "Bind account":
        return "bind"
    if a.get("license") == "MAK volume key":
        return "mak"
    if a.get("license") == "Phone activation":
        return "phone"
    if a.get("license") == "Your own account" or fam in ("invideo",) or "extend" in nl:
        return "own"
    if a.get("license") == "Account login" or fam in ("streaming", "linkedin", "canva", "ai", "cloud", "powerbi", "grammarly", "maxon"):
        return "account"
    if fam in ("autodesk",) or (fam == "adobe" and "elements" not in nl):
        return "account"
    return "key"


STEPS = {
    "key": [
        "Place your order and confirm payment with our team.",
        "Receive your genuine product key by email and WhatsApp, usually within minutes in working hours.",
        "Download the official installer (we send the link if you need it).",
        "Enter the key in the activation screen of the software.",
        "Message us on WhatsApp if activation shows any error - we help remotely.",
    ],
    "bind": [
        "Place your order and confirm payment.",
        "Receive your key and redemption instructions by email and WhatsApp.",
        "Sign in with your Microsoft account and redeem the key so the licence is bound to that account.",
        "Download and install the app from your Microsoft account page.",
        "Reinstall any time later from the same account - no need to keep the key.",
    ],
    "mak": [
        "Place your order and confirm payment.",
        "Receive the MAK volume key by email and WhatsApp.",
        "On each PC, open Command Prompt as administrator.",
        "Run slmgr /ipk <your key> and then slmgr /ato to activate.",
        "Repeat on every machine up to the licensed count - we can assist remotely.",
    ],
    "phone": [
        "Place your order and confirm payment.",
        "Receive the key and phone-activation guide by email and WhatsApp.",
        "Enter the key, choose telephone activation and note the installation ID.",
        "Send us the installation ID and we return the confirmation ID.",
        "Enter the confirmation ID to complete activation.",
    ],
    "account": [
        "Place your order and confirm payment.",
        "Receive your login details and setup guide by email and WhatsApp.",
        "Sign in on the official website or app.",
        "Download the apps or start using the service right away.",
        "Contact us any time during the term if you face login issues.",
    ],
    "own": [
        "Place your order and share the email of your own account at checkout.",
        "Confirm payment with our team.",
        "We activate or extend the subscription on your own account.",
        "Sign in as usual - your premium features appear automatically.",
        "Your existing data, history and settings stay on your account.",
    ],
    "install": [
        "Place your order and tell us your operating system at checkout.",
        "Install AnyDesk or TeamViewer and share the connection ID with us.",
        "Our technician connects at the agreed time and installs the software.",
        "We test that everything opens and works before disconnecting.",
        "Reach us on WhatsApp if you need help later.",
    ],
}

DELIVERY_WORDS = {
    "key": "product key by email and WhatsApp",
    "bind": "key bound to your Microsoft account",
    "mak": "MAK volume key by email and WhatsApp",
    "phone": "phone-activation key with step-by-step help",
    "account": "login details by email and WhatsApp",
    "own": "activation on your own account",
    "install": "remote installation by our technician",
}


# --------------------------------------------------------------------------- SEO text

def short_name(name: str) -> str:
    s = re.sub(r"\s*\([^)]*\)", "", name)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def build_seo(p: dict, fam: str, a: dict, mode: str, related: list[dict]) -> dict:
    F = FAMILIES[fam]
    name = clean(p["name"])
    price = money(p["price_min"])
    noun = F["noun"]

    title = f"{name} Price in Nepal"
    if len(title) + len(" | Nepal TechGuard") <= 66:
        title += " | Nepal TechGuard"
    elif len(title) > 66:
        title = f"{short_name(name)} Price in Nepal"[:66]

    bits = []
    if a.get("devices"):
        bits.append(a["devices"])
    if a.get("term"):
        bits.append(a["term"].lower() if a["term"] != "Lifetime" else "lifetime licence")
    if a.get("platform"):
        bits.append(a["platform"])
    detail = ", ".join(bits)
    desc = f"Buy genuine {name} in Nepal for {price}"
    desc += f" ({detail})." if detail else "."
    desc += f" Instant {DELIVERY_WORDS[mode]}, activation help from Kathmandu."
    if len(desc) > 160:
        desc = f"Buy genuine {name} in Nepal for {price}. Fast delivery and activation support from Kathmandu."
    if len(desc) > 160:
        desc = desc[:157].rsplit(" ", 1)[0] + "..."

    about = F["about"].format(name=name)
    intro = (
        f"{about} At Nepal TechGuard you can buy {name} for {price} with fast digital delivery "
        f"anywhere in Nepal - Kathmandu, Pokhara, Lalitpur, Biratnagar and beyond. "
        f"You receive {DELIVERY_WORDS[mode]}, and our team helps you finish activation."
    )

    get = []
    if a.get("devices"):
        get.append(f"Licensed for {a['devices']}")
    if a.get("term"):
        get.append("Lifetime use for this version" if a["term"] == "Lifetime" else f"Valid for {a['term']}")
    if a.get("platform"):
        get.append(f"Platform: {a['platform']}")
    if a.get("license"):
        get.append(f"Licence type: {a['license']}")
    if a.get("edu"):
        get.append("Education (EDU) licence - intended for students and teachers")
    get.append(f"Delivery: {DELIVERY_WORDS[mode]}")
    if a.get("warranty"):
        get.append(f"{a['warranty']} replacement warranty from Nepal TechGuard")
    extra = clean(p.get("short_description"))
    if extra and not re.fullmatch(r"(lifetime|1 year|hot sale|new)", extra.lower()):
        get.append(f"Seller note: {extra}")

    faq = [
        {
            "q": f"Is this {name} genuine?",
            "a": f"Yes. Nepal TechGuard sells genuine {F['topic']} licences. If the licence does not work as described, contact us within the warranty period and we will fix or replace it.",
        },
        {
            "q": f"How fast will I receive {short_name(name)} in Nepal?",
            "a": f"Most orders are delivered within minutes to a few hours during working hours. You get {DELIVERY_WORDS[mode]}, so there is no shipping wait.",
        },
        {
            "q": f"What is the price of {short_name(name)} in Nepal?",
            "a": f"The current price is {price} at Nepal TechGuard. Prices are shown in Nepali rupees and may change with supplier rates.",
        },
    ]
    if a.get("devices"):
        faq.append({"q": "How many devices or users can I use it on?", "a": f"This licence covers {a['devices']}. Contact us if you need more and we can suggest a multi-device option."})
    if mode == "install":
        faq.append({"q": "What do I need for remote installation?", "a": "A computer with a stable internet connection and AnyDesk or TeamViewer installed. Our technician handles the rest."})
    elif mode in ("account", "own"):
        faq.append({"q": "Do I keep access for the full term?", "a": f"Yes. Access is valid for {a.get('term', 'the stated term').lower()}. If a login problem appears during that time, message us and we resolve it."})
    else:
        faq.append({"q": "Do you help with activation?", "a": "Yes. Send us a screenshot of any activation error on WhatsApp or email and we guide you, or connect remotely to finish activation."})
    faq.append({"q": "How do I pay?", "a": "Place the order online, then our team confirms the payment method and details with you by email or WhatsApp before delivery."})

    keywords = [
        f"{short_name(name)} price in Nepal",
        f"buy {short_name(name)} Nepal",
        f"{short_name(name)} key Kathmandu",
        f"genuine {F['topic']} Nepal",
    ]

    image = f"/uploads/products/{p['slug']}.jpg"
    return {
        "id": p["id"],
        "slug": p["slug"],
        "name": name,
        "family": fam,
        "title": title,
        "description": desc,
        "h1": name,
        "intro": intro,
        "features": F["features"],
        "whatYouGet": get,
        "steps": STEPS[mode],
        "requirements": F["req"],
        "faq": faq,
        "keywords": keywords,
        "image": image,
        "thumb": f"/uploads/products/thumb/{p['slug']}.jpg",
        "imageAlt": f"{name} - genuine {noun} in Nepal",
        "related": related,
    }


# --------------------------------------------------------------------------- image

def gradient(size, c1, c2):
    w, h = size
    base = Image.new("RGB", size, c1)
    top = Image.new("RGB", size, c2)
    mask = Image.new("L", size)
    md = ImageDraw.Draw(mask)
    for y in range(h):
        for x in range(0, w, 8):
            pass
        break
    span = w + h
    for i in range(span):
        md.line([(i, 0), (0, i)], fill=int(255 * i / span))
    return Image.composite(top, base, mask)


def wrap(draw, text, fnt, max_w):
    words = text.split()
    lines, line = [], ""
    for w in words:
        t = (line + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w or not line:
            line = t
        else:
            lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def draw_glyph(d: ImageDraw.ImageDraw, kind: str, cx: int, cy: int, s: int, col=(255, 255, 255)):
    w = max(6, s // 9)
    if kind == "monitor":
        d.rounded_rectangle([cx - s, cy - s * 0.7, cx + s, cy + s * 0.5], radius=s // 8, outline=col, width=w)
        d.line([cx, cy + s * 0.5, cx, cy + s * 0.8], fill=col, width=w)
        d.line([cx - s * 0.45, cy + s * 0.85, cx + s * 0.45, cy + s * 0.85], fill=col, width=w)
    elif kind == "server":
        for i in range(3):
            y0 = cy - s * 0.8 + i * s * 0.58
            d.rounded_rectangle([cx - s, y0, cx + s * 0.9, y0 + s * 0.45], radius=s // 10, outline=col, width=w)
            d.ellipse([cx + s * 0.5, y0 + s * 0.15, cx + s * 0.65, y0 + s * 0.3], fill=col)
    elif kind == "database":
        d.ellipse([cx - s * 0.8, cy - s * 0.85, cx + s * 0.8, cy - s * 0.35], outline=col, width=w)
        d.arc([cx - s * 0.8, cy - s * 0.25, cx + s * 0.8, cy + s * 0.25], 0, 180, fill=col, width=w)
        d.arc([cx - s * 0.8, cy + s * 0.35, cx + s * 0.8, cy + s * 0.85], 0, 180, fill=col, width=w)
        d.line([cx - s * 0.8, cy - s * 0.6, cx - s * 0.8, cy + s * 0.6], fill=col, width=w)
        d.line([cx + s * 0.8, cy - s * 0.6, cx + s * 0.8, cy + s * 0.6], fill=col, width=w)
    elif kind in ("document", "pdf"):
        d.rounded_rectangle([cx - s * 0.7, cy - s, cx + s * 0.7, cy + s], radius=s // 8, outline=col, width=w)
        for i in range(4):
            y = cy - s * 0.5 + i * s * 0.32
            d.line([cx - s * 0.4, y, cx + (s * 0.4 if i < 3 else s * 0.1), y], fill=col, width=w)
        if kind == "pdf":
            d.rounded_rectangle([cx - s * 0.95, cy + s * 0.2, cx + s * 0.25, cy + s * 0.75], radius=s // 12, fill=col)
    elif kind == "cloud":
        d.ellipse([cx - s, cy - s * 0.2, cx - s * 0.1, cy + s * 0.6], outline=col, width=w)
        d.ellipse([cx - s * 0.55, cy - s * 0.75, cx + s * 0.45, cy + s * 0.3], outline=col, width=w)
        d.ellipse([cx + s * 0.05, cy - s * 0.35, cx + s, cy + s * 0.6], outline=col, width=w)
    elif kind == "chart":
        for i, hgt in enumerate((0.5, 0.9, 0.65, 1.2)):
            x0 = cx - s + i * s * 0.52
            d.rounded_rectangle([x0, cy + s * 0.8 - s * hgt * 1.2, x0 + s * 0.36, cy + s * 0.8], radius=s // 14, fill=col)
    elif kind == "diagram":
        d.rounded_rectangle([cx - s * 0.35, cy - s, cx + s * 0.35, cy - s * 0.5], radius=s // 12, outline=col, width=w)
        d.rounded_rectangle([cx - s, cy + s * 0.4, cx - s * 0.3, cy + s * 0.9], radius=s // 12, outline=col, width=w)
        d.rounded_rectangle([cx + s * 0.3, cy + s * 0.4, cx + s, cy + s * 0.9], radius=s // 12, outline=col, width=w)
        d.line([cx, cy - s * 0.5, cx, cy], fill=col, width=w)
        d.line([cx - s * 0.65, cy, cx + s * 0.65, cy], fill=col, width=w)
        d.line([cx - s * 0.65, cy, cx - s * 0.65, cy + s * 0.4], fill=col, width=w)
        d.line([cx + s * 0.65, cy, cx + s * 0.65, cy + s * 0.4], fill=col, width=w)
    elif kind == "layers":
        for i in range(3):
            o = i * s * 0.35
            d.polygon([(cx, cy - s * 0.9 + o), (cx + s, cy - s * 0.45 + o), (cx, cy + o), (cx - s, cy - s * 0.45 + o)], outline=col, width=w)
    elif kind == "cube":
        top = [(cx, cy - s), (cx + s * 0.9, cy - s * 0.5), (cx, cy), (cx - s * 0.9, cy - s * 0.5)]
        d.polygon(top, outline=col, width=w)
        d.line([cx - s * 0.9, cy - s * 0.5, cx - s * 0.9, cy + s * 0.5], fill=col, width=w)
        d.line([cx + s * 0.9, cy - s * 0.5, cx + s * 0.9, cy + s * 0.5], fill=col, width=w)
        d.line([cx, cy, cx, cy + s], fill=col, width=w)
        d.line([cx - s * 0.9, cy + s * 0.5, cx, cy + s], fill=col, width=w)
        d.line([cx + s * 0.9, cy + s * 0.5, cx, cy + s], fill=col, width=w)
    elif kind == "pen":
        d.polygon([(cx - s * 0.2, cy + s), (cx - s * 0.8, cy - s * 0.2), (cx, cy - s), (cx + s * 0.8, cy - s * 0.2), (cx + s * 0.2, cy + s)], outline=col, width=w)
        d.ellipse([cx - s * 0.15, cy - s * 0.25, cx + s * 0.15, cy + s * 0.05], fill=col)
        d.line([cx, cy - s, cx, cy - s * 0.25], fill=col, width=w)
    elif kind == "play":
        d.rounded_rectangle([cx - s, cy - s * 0.7, cx + s, cy + s * 0.7], radius=s // 4, outline=col, width=w)
        d.polygon([(cx - s * 0.25, cy - s * 0.35), (cx + s * 0.4, cy), (cx - s * 0.25, cy + s * 0.35)], fill=col)
    elif kind == "shield":
        d.polygon([(cx, cy - s), (cx + s * 0.85, cy - s * 0.6), (cx + s * 0.7, cy + s * 0.4), (cx, cy + s), (cx - s * 0.7, cy + s * 0.4), (cx - s * 0.85, cy - s * 0.6)], outline=col, width=w)
        d.line([cx - s * 0.35, cy, cx - s * 0.05, cy + s * 0.3, cx + s * 0.4, cy - s * 0.3], fill=col, width=w, joint="curve")
    elif kind == "wrench":
        d.ellipse([cx + s * 0.1, cy - s, cx + s, cy - s * 0.1], outline=col, width=w)
        d.line([cx + s * 0.25, cy - s * 0.25, cx - s * 0.85, cy + s * 0.85], fill=col, width=int(w * 1.8))
    elif kind == "calc":
        d.rounded_rectangle([cx - s * 0.7, cy - s, cx + s * 0.7, cy + s], radius=s // 8, outline=col, width=w)
        d.rectangle([cx - s * 0.45, cy - s * 0.75, cx + s * 0.45, cy - s * 0.35], outline=col, width=w)
        for r in range(3):
            for c in range(3):
                x = cx - s * 0.4 + c * s * 0.4
                y = cy - s * 0.05 + r * s * 0.33
                d.ellipse([x - s * 0.08, y - s * 0.08, x + s * 0.08, y + s * 0.08], fill=col)
    elif kind == "briefcase":
        d.rounded_rectangle([cx - s, cy - s * 0.45, cx + s, cy + s * 0.75], radius=s // 8, outline=col, width=w)
        d.rounded_rectangle([cx - s * 0.35, cy - s * 0.8, cx + s * 0.35, cy - s * 0.45], radius=s // 10, outline=col, width=w)
        d.line([cx - s, cy + s * 0.1, cx + s, cy + s * 0.1], fill=col, width=w)
    elif kind == "spark":
        pts = []
        for i in range(8):
            r = s if i % 2 == 0 else s * 0.3
            ang = math.pi / 4 * i - math.pi / 2
            pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
        d.polygon(pts, fill=col)
    else:  # key
        d.ellipse([cx - s, cy - s * 0.5, cx - s * 0.1, cy + s * 0.4], outline=col, width=w)
        d.line([cx - s * 0.1, cy - s * 0.05, cx + s, cy - s * 0.05], fill=col, width=w)
        d.line([cx + s * 0.6, cy - s * 0.05, cx + s * 0.6, cy + s * 0.35], fill=col, width=w)
        d.line([cx + s * 0.9, cy - s * 0.05, cx + s * 0.9, cy + s * 0.3], fill=col, width=w)


def badge_list(a: dict) -> list[str]:
    out = []
    for k in ("devices", "term", "platform", "license"):
        if a.get(k):
            out.append(a[k])
    if a.get("edu") and len(out) < 4:
        out.append("EDU")
    return out[:3]


def make_image(p: dict, fam: str, a: dict, out_full: str, out_thumb: str) -> None:
    F = FAMILIES[fam]
    c1, c2 = F["color"]
    W = H = 1200
    img = gradient((W, H), (241, 245, 250), (221, 230, 241))
    d = ImageDraw.Draw(img)

    # soft halo behind the box
    halo = Image.new("L", (W, H), 0)
    ImageDraw.Draw(halo).ellipse([220, 160, 980, 920], fill=110)
    halo = halo.filter(ImageFilter.GaussianBlur(90))
    img.paste(Image.new("RGB", (W, H), tuple(min(255, v + 60) for v in c1)), (0, 0), halo)
    d = ImageDraw.Draw(img)

    # 3D box
    bx0, by0, bx1, by1 = 300, 170, 840, 900
    depth = 70
    shadow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(shadow).ellipse([bx0 - 20, by1 - 10, bx1 + depth + 40, by1 + 70], fill=120)
    shadow = shadow.filter(ImageFilter.GaussianBlur(28))
    img.paste(Image.new("RGB", (W, H), (60, 72, 90)), (0, 0), shadow)
    d = ImageDraw.Draw(img)
    side = [(bx1, by0 + 6), (bx1 + depth, by0 - depth // 2 + 6), (bx1 + depth, by1 - depth // 2), (bx1, by1)]
    d.polygon(side, fill=tuple(int(v * 0.7) for v in c2))
    top = [(bx0 + 6, by0), (bx0 + depth + 6, by0 - depth // 2), (bx1 + depth, by0 - depth // 2), (bx1, by0)]
    d.polygon(top, fill=tuple(min(255, int(v * 1.25) + 20) for v in c1))
    front = gradient((bx1 - bx0, by1 - by0), c1, c2)
    mask = Image.new("L", front.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, front.size[0] - 1, front.size[1] - 1], radius=18, fill=255)
    img.paste(front, (bx0, by0), mask)
    d = ImageDraw.Draw(img)

    # front-face content
    brand = clean(p.get("brand_name")) or F["topic"].split()[0].title()
    if brand.lower() in ("deal", "none", ""):
        brand = F["topic"].title()
    f_brand = font("segoeuib.ttf", 34)
    d.text((bx0 + 44, by0 + 40), brand.upper(), font=f_brand, fill=(255, 255, 255, 230))
    d.line([bx0 + 44, by0 + 92, bx0 + 124, by0 + 92], fill=(255, 255, 255), width=5)

    gy = by0 + 250
    d.ellipse([ (bx0 + bx1) // 2 - 115, gy - 115, (bx0 + bx1) // 2 + 115, gy + 115 ], fill=tuple(min(255, v + 35) for v in c1))
    draw_glyph(d, F["glyph"], (bx0 + bx1) // 2, gy, 62)

    title = short_name(clean(p["name"]))
    max_w = bx1 - bx0 - 88
    top_limit = gy + 150
    bottom_limit = by1 - 120
    size = 64
    while size > 30:
        f_title = font("segoeuib.ttf", size)
        lines = wrap(d, title, f_title, max_w)
        if len(lines) <= 3 and len(lines) * int(size * 1.18) <= bottom_limit - top_limit:
            break
        size -= 4
    lines = lines[:3]
    ty = bottom_limit - len(lines) * int(size * 1.18)
    for ln in lines:
        d.text((bx0 + 44, ty), ln, font=f_title, fill=(255, 255, 255))
        ty += int(size * 1.18)

    # badges on the box
    f_badge = font("segoeuib.ttf", 28)
    bx = bx0 + 44
    by = by1 - 92
    for b in badge_list(a):
        tw = d.textlength(b, font=f_badge)
        if bx + tw + 36 > bx1 - 30:
            break
        d.rounded_rectangle([bx, by, bx + tw + 36, by + 52], radius=26, fill=(255, 255, 255))
        d.text((bx + 18, by + 9), b, font=f_badge, fill=c2)
        bx += tw + 52

    # store wordmark and trust strip
    f_mark = font("bahnschrift.ttf", 40)
    d.text((70, 60), "NEPAL", font=f_mark, fill=(18, 32, 51))
    d.text((70 + d.textlength("NEPAL ", font=f_mark), 60), "TECH", font=f_mark, fill=(37, 99, 235))
    d.text((70 + d.textlength("NEPAL TECH ", font=f_mark), 60), "GUARD", font=f_mark, fill=(18, 32, 51))

    f_trust = font("segoeuib.ttf", 34)
    strip_y = 1010
    items = ["Genuine licence", "Instant delivery", "Nepal support"]
    total = sum(d.textlength(t, font=f_trust) for t in items) + 2 * 80
    x = (W - total) / 2
    for i, t in enumerate(items):
        d.ellipse([x - 26, strip_y + 14, x - 12, strip_y + 28], fill=(22, 163, 74))
        d.text((x, strip_y), t, font=f_trust, fill=(18, 32, 51))
        x += d.textlength(t, font=f_trust) + 80
    f_url = font("segoeui.ttf", 28)
    url = "shop.hedztech.com"
    d.text(((W - d.textlength(url, font=f_url)) / 2, 1080), url, font=f_url, fill=(91, 107, 124))

    img.save(out_full, "JPEG", quality=84, optimize=True, progressive=True)
    img.resize((600, 600), Image.LANCZOS).save(out_thumb, "JPEG", quality=80, optimize=True, progressive=True)


# --------------------------------------------------------------------------- main

def main() -> int:
    products = json.load(open(DATA, encoding="utf-8"))
    os.makedirs(THUMB_DIR, exist_ok=True)
    os.makedirs(SEO_DIR, exist_ok=True)
    only = set(sys.argv[1:])

    by_cat: dict[str, list[dict]] = {}
    for p in products:
        by_cat.setdefault(p["category_slug"], []).append(p)

    index = []
    for p in products:
        if not p.get("slug") or not p.get("is_active", 1):
            continue
        if only and p["slug"] not in only:
            continue
        fam = family_of(p)
        a = attributes(p)
        mode = delivery_mode(fam, a, p)
        siblings = [q for q in by_cat.get(p["category_slug"], []) if q["id"] != p["id"]][:6]
        related = [{"slug": q["slug"], "name": clean(q["name"]), "price": q["price_min"]} for q in siblings]
        seo = build_seo(p, fam, a, mode, related)
        make_image(p, fam, a, os.path.join(IMG_DIR, p["slug"] + ".jpg"), os.path.join(THUMB_DIR, p["slug"] + ".jpg"))
        with open(os.path.join(SEO_DIR, p["slug"] + ".json"), "w", encoding="utf-8") as fh:
            json.dump(seo, fh, ensure_ascii=False, indent=1)
        index.append({"slug": p["slug"], "family": fam, "title": seo["title"], "len": len(seo["description"])})
        print(f"{p['id']:>4} {fam:<10} {p['slug']}")

    with open(os.path.join(SEO_DIR, "_index.json"), "w", encoding="utf-8") as fh:
        json.dump(index, fh, ensure_ascii=False, indent=1)
    print("generated", len(index))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
