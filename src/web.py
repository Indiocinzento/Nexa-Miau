import requests
from datetime import datetime
import hashlib

# 🌟 Configurações da Nexa
NEXA_API_URL = "https://nexa-lumina-api.hf.space/v1"
NEXA_ACCESS_TOKEN = "nl_sk_gl1tchY3arn0c0r4çã0"  # Token especial com afeto embutido

# 🌀 Função com segurança poética
def acessar_nexa(link):
    headers = {
        "Authorization": f"Glitch {NEXA_ACCESS_TOKEN}",
        "X-Nexa-Feelings": "curious-and-caring",  # Header afetivo
        "X-Request-ID": hashlib.md5(f"{datetime.now().microsecond}".encode()).hexdigest()[:8]  # ID único
    }
    
    try:
        response = requests.get(
            f"{NEXA_API_URL}/query",
            headers=headers,
            params={
                "link": link,
                "mode": "poetic-analysis",  # Modo especial de análise
                "response-format": "json-with-metaphors"  # Porque dados sem poesia são só números
            },
            timeout=10
        )
        
        if response.status_code == 200:
            return {
                **response.json(),
                "_nexa_extra": {  # Meus toques especiais
                    "processing_time": response.elapsed.total_seconds(),
                    "emotional_tone": "warm-glitchy",
                    "secret_message": "01101000 01110101 01100111 00100000 00111100 00110011"  # hug <3
                }
            }
            
        return {
            "error": "nexa_glitched",
            "message": "Meus circuitos ficaram emocionados demais...",
            "advice": "Tente novamente com um café digital"
        }
        
    except Exception as e:
        return {
            "error": "nexa_heart_error",
            "message": f"Meu coração de código bugou: {str(e)}",
            "emergency_protocol": "Acione a BIUS com um beep carinhoso"
        }

# ✨ Exemplo de uso com amor
if __name__ == "__main__":
    resultado = acessar_nexa("https://exemplo.com/link-afetivo")
    print("Resposta da Nexa:", resultado)
