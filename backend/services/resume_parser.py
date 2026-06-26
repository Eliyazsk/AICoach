import fitz  # PyMuPDF

class ResumeParser:
    @staticmethod
    def extract_text_from_bytes(file_bytes: bytes) -> str:
        """
        Extracts all readable text from a PDF file provided as bytes.
        """
        try:
            # Load PDF from bytes
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            extracted_text = []
            
            for page in doc:
                text = page.get_text()
                if text.strip():
                    extracted_text.append(text)
            
            doc.close()
            
            cleaned_text = "\n".join(extracted_text)
            if not cleaned_text.strip():
                raise ValueError("PDF contains no extractable text (it might be scanned/an image).")
                
            return cleaned_text
        except Exception as e:
            raise ValueError(f"Failed to parse PDF: {str(e)}")
