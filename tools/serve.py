#!/usr/bin/env python3
"""Preview the wiki locally at http://localhost:8000

Pages are served at clean, extensionless URLs (docs/realms/index.html is reached
as /docs/realms/), and only a real HTTP server resolves those — opening
index.html from disk gives you a file:// directory listing instead of the page.
So use this rather than double-clicking.

    python tools/serve.py            # port 8000, opens your browser
    python tools/serve.py 8080       # different port
    python tools/serve.py --no-open  # don't open a browser

Stop it with Ctrl+C. Standard library only.
"""
from __future__ import annotations

import contextlib
import functools
import http.server
import os
import pathlib
import socketserver
import sys
import threading
import webbrowser

ROOT = pathlib.Path(__file__).resolve().parent.parent


class Handler(http.server.SimpleHTTPRequestHandler):
    """Adds the two behaviours GitHub Pages has that http.server lacks."""

    def send_error(self, code, message=None, explain=None):
        # Serve the themed 404 page, like GitHub Pages does.
        if code == 404:
            page = ROOT / "404.html"
            if page.exists():
                body = page.read_bytes()
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                with contextlib.suppress(BrokenPipeError):
                    self.wfile.write(body)
                return
        super().send_error(code, message, explain)

    def end_headers(self):
        # Never cache during preview, or edits appear not to take effect.
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def log_message(self, fmt, *args):
        status = str(args[1]) if len(args) > 1 else ""
        if status.startswith(("4", "5")):          # only surface problems
            sys.stderr.write("  %s %s\n" % (status, args[0]))


def main() -> None:
    args = [a for a in sys.argv[1:]]
    open_browser = "--no-open" not in args
    args = [a for a in args if not a.startswith("--")]
    port = int(args[0]) if args else 8000

    os.chdir(ROOT)

    class Server(socketserver.ThreadingTCPServer):
        # Threaded: a single-threaded server stalls badly when a page pulls its
        # CSS, JS and several SVGs at once.
        allow_reuse_address = True
        daemon_threads = True

    try:
        server = Server(("", port), Handler)
    except OSError as e:
        sys.exit(f"could not bind port {port}: {e}\ntry: python tools/serve.py {port + 1}")

    url = f"http://localhost:{port}/"
    print(f"Cultivation wiki -> {url}")
    print(f"serving {ROOT}")
    print("Ctrl+C to stop\n")
    if open_browser:
        threading.Timer(0.6, functools.partial(webbrowser.open, url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")
        server.server_close()


if __name__ == "__main__":
    main()
