"""Upload a local staging folder to shop.hedztech.com over FTP_TLS."""
from __future__ import annotations

import json
import os
import sys
import ftplib

SKIP_NAMES = {".git", "node_modules"}
SKIP_SUFFIXES = (
    "/config/database.php",
    "\\config\\database.php",
    "config/database.php",
)


def should_skip(rel: str) -> bool:
    norm = rel.replace("\\", "/").lstrip("./")
    if norm.endswith(".zip") or norm.endswith(".sql"):
        return True
    if any(norm.endswith(s.replace("\\", "/")) for s in SKIP_SUFFIXES):
        return True
    if norm == "config/database.php":
        return True
    return False


def ensure_dir(ftp: ftplib.FTP, remote_dir: str) -> None:
    parts = [p for p in remote_dir.replace("\\", "/").split("/") if p]
    path = ""
    for part in parts:
        path += "/" + part
        try:
            ftp.mkd(path)
        except ftplib.error_perm:
            pass


def connect(cfg: dict) -> ftplib.FTP:
    host = cfg["host"]
    port = int(cfg.get("port") or 21)
    user = cfg["username"]
    password = cfg["password"]
    ftp = ftplib.FTP_TLS()
    ftp.connect(host, port, timeout=45)
    ftp.auth()
    ftp.prot_p()
    ftp.login(user, password)
    ftp.set_pasv(True)
    ftp.encoding = "utf-8"
    return ftp


def main() -> int:
    if len(sys.argv) < 3:
        print("Usage: ftp-deploy.py <staging_dir> <ftp-config.json>", file=sys.stderr)
        return 2

    staging = os.path.abspath(sys.argv[1])
    config_path = os.path.abspath(sys.argv[2])
    if not os.path.isdir(staging):
        print("Staging folder missing:", staging, file=sys.stderr)
        return 1
    if not os.path.isfile(config_path):
        print("Missing FTP config:", config_path, file=sys.stderr)
        print("Copy deploy/ftp-config.example.json to deploy/ftp-config.json", file=sys.stderr)
        return 1

    with open(config_path, encoding="utf-8") as fh:
        cfg = json.load(fh)

    remote_root = (cfg.get("remotePath") or "/").rstrip("/") or ""
    site = cfg.get("siteUrl") or ""

    uploaded = 0
    skipped = 0
    ftp = connect(cfg)
    print("Connected to", cfg["host"], "as", cfg["username"])
    if site:
        print("Site", site)

    try:
        for dirpath, dirnames, filenames in os.walk(staging):
            dirnames[:] = [d for d in dirnames if d not in SKIP_NAMES]
            rel_dir = os.path.relpath(dirpath, staging)
            if rel_dir == ".":
                remote_dir = remote_root + "/" if remote_root else "/"
            else:
                remote_dir = (remote_root + "/" + rel_dir.replace("\\", "/")).replace("//", "/")
            ensure_dir(ftp, remote_dir)

            for name in filenames:
                local = os.path.join(dirpath, name)
                rel = os.path.relpath(local, staging).replace("\\", "/")
                if should_skip(rel):
                    skipped += 1
                    continue
                remote = (remote_root + "/" + rel).replace("//", "/")
                if not remote.startswith("/"):
                    remote = "/" + remote
                with open(local, "rb") as fh:
                    ftp.storbinary("STOR " + remote, fh)
                uploaded += 1
                if uploaded % 25 == 0:
                    print("uploaded", uploaded, "files...")
    finally:
        try:
            ftp.quit()
        except Exception:
            ftp.close()

    print("Uploaded", uploaded, "files. Skipped", skipped, "(zip/sql/database.php).")
    print("Did not overwrite config/database.php.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
