from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from markitdown import MarkItDown
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Set to DEBUG for maximum verbosity
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

# Middleware to log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

@app.post("/convert")
async def convert_file(file: UploadFile = File(...)):
    logger.debug(f"Received file: {file.filename}")
    # Save the uploaded file temporarily
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Convert to Markdown
    try:
        md = MarkItDown()
        markdown_content = md.convert(file_path)
    except Exception as e:
        os.remove(file_path)
        return {"error": str(e)}

    # Clean up the temporary file
    os.remove(file_path)

    return {"markdown": markdown_content}