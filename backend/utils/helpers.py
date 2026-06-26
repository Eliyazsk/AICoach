def sanitize_text(text: str) -> str:
    """
    Cleans up any excessive whitespaces or formatting issues from raw text.
    """
    if not text:
        return ""
    # Remove excessive blank lines
    lines = [line.strip() for line in text.splitlines()]
    non_empty_lines = [line for line in lines if line]
    return "\n".join(non_empty_lines)
