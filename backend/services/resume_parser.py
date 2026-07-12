import io
from pypdf import PdfReader

class ResumeParser:
    @staticmethod
    def extract_text_from_bytes(file_bytes: bytes) -> str:
        """
        Extracts all readable text from a PDF file provided as bytes.
        """
        try:
            # Load PDF from bytes
            reader = PdfReader(io.BytesIO(file_bytes))
            extracted_text = []
            
            for page in reader.pages:
                text = page.extract_text()
                if text and text.strip():
                    extracted_text.append(text)
            
            cleaned_text = "\n".join(extracted_text)
            if not cleaned_text.strip():
                raise ValueError("PDF contains no extractable text (it might be scanned/an image).")
                
            return cleaned_text
        except Exception as e:
            raise ValueError(f"Failed to parse PDF: {str(e)}")
