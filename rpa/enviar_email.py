from __future__ import annotations

import argparse
import os
import smtplib
import sys
from email.message import EmailMessage

from dotenv import load_dotenv

from logger_utils import get_logger

logger = get_logger("email.log")
load_dotenv()


def obter_credenciais() -> tuple[str, str]:
    email_remetente = os.getenv("EMAIL_REMETENTE")
    senha_app = os.getenv("EMAIL_SENHA_APP")

    if not email_remetente or not senha_app:
        raise ValueError(
            "Defina EMAIL_REMETENTE e EMAIL_SENHA_APP em um arquivo .env dentro da pasta rpa ou nas variáveis de ambiente."
        )

    return email_remetente, senha_app


def montar_email(destinatario: str, nome: str, vaga: str, empresa: str, link: str | None) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = f"Atualização de candidatura - {vaga}"
    msg["To"] = destinatario

    corpo = (
        f"Olá, {nome},\n\n"
        f"Esta é uma mensagem automática do Portal de Vagas da AV2.\n"
        f"A vaga '{vaga}' na empresa {empresa} está sendo acompanhada pelo sistema.\n"
    )

    if link:
        corpo += f"Link da vaga: {link}\n"

    corpo += "\nMensagem enviada para fins de demonstração da automação com Python.\n"
    msg.set_content(corpo)
    return msg


def enviar_email_smtp(destinatario: str, nome: str, vaga: str, empresa: str, link: str | None) -> None:
    email_remetente, senha_app = obter_credenciais()
    msg = montar_email(destinatario, nome, vaga, empresa, link)
    msg["From"] = email_remetente

    logger.info("Iniciando envio de e-mail para %s", destinatario)

    with smtplib.SMTP("smtp.gmail.com", 587) as servidor:
        servidor.starttls()
        servidor.login(email_remetente, senha_app)
        servidor.send_message(msg)

    logger.info("E-mail enviado com sucesso para %s", destinatario)


def main() -> int:
    parser = argparse.ArgumentParser(description="Envia e-mail via SMTP do Gmail")
    parser.add_argument("--destinatario", required=True, help="E-mail de destino")
    parser.add_argument("--nome", required=True, help="Nome do destinatário")
    parser.add_argument("--vaga", required=True, help="Título da vaga")
    parser.add_argument("--empresa", required=True, help="Nome da empresa")
    parser.add_argument("--link", default="", help="Link opcional da vaga")
    args = parser.parse_args()

    try:
        enviar_email_smtp(args.destinatario, args.nome, args.vaga, args.empresa, args.link or None)
        print("E-mail enviado com sucesso.")
        return 0
    except Exception as exc:
        logger.exception("Falha no envio de e-mail: %s", exc)
        print(f"Erro ao enviar e-mail: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())