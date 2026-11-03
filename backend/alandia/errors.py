from typing import Any

from flask import Flask, request
from werkzeug.exceptions import HTTPException


class ApiError(Exception):
    def __init__(self, status: int, message: str):
        super().__init__(message)
        self.status = status
        self.message = message


def json_body() -> dict[str, Any]:
    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        raise ApiError(400, "Corps JSON attendu.")
    return body


def init_app(app: Flask) -> None:
    @app.errorhandler(ApiError)
    def handle_api_error(err: ApiError):
        return {"error": err.message}, err.status

    @app.errorhandler(HTTPException)
    def handle_http_error(err: HTTPException):
        return {"error": err.description}, err.code
