import base64
import hashlib
import hmac
import os
import secrets


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return f"{base64.b64encode(salt).decode()}:{base64.b64encode(digest).decode()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt_b64, digest_b64 = stored_hash.split(":", 1)
    except ValueError:
        return False

    salt = base64.b64decode(salt_b64.encode())
    expected_digest = base64.b64decode(digest_b64.encode())
    actual_digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return hmac.compare_digest(actual_digest, expected_digest)


def create_session_token() -> str:
    return secrets.token_urlsafe(32)
