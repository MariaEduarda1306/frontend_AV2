from __future__ import annotations

import argparse
import sys
import time

import pywhatkit

from logger_utils import get_logger

logger = get_logger("whatsapp.log")


def validar_numero(numero: str) -> str:
    numero = numero.strip()
    if not numero.startswith("+"):
        raise ValueError("O número deve estar no formato internacional, por exemplo: +5548999999999")
    return numero


def montar_mensagem(nome: str, vaga: str, empresa: str, link: str | None) -> str:
    mensagem = (
        f"Olá, {nome}!\n"
        f"A vaga '{vaga}' na empresa {empresa} recebeu uma nova atualização no Portal de Vagas da AV2.\n"
        f"Confira os detalhes e acompanhe a candidatura."
    )
    if link:
        mensagem += f"\nLink: {link}"
    return mensagem


def enviar_whatsapp(numero: str, mensagem: str, esperar: int = 20, fechar_aba: bool = False) -> None:
    logger.info("Iniciando envio de WhatsApp para %s", numero)
    pywhatkit.sendwhatmsg_instantly(
        phone_no=numero,
        message=mensagem,
        wait_time=esperar,
        tab_close=fechar_aba,
        close_time=5,
    )
    time.sleep(3)
    logger.info("Fluxo de envio ao WhatsApp disparado com sucesso para %s", numero)


def main() -> int:
    parser = argparse.ArgumentParser(description="Envia mensagem via WhatsApp Web com PyWhatKit")
    parser.add_argument("--numero", required=True, help="Número no formato +55DDDNÚMERO")
    parser.add_argument("--nome", required=True, help="Nome do destinatário")
    parser.add_argument("--vaga", required=True, help="Título da vaga")
    parser.add_argument("--empresa", required=True, help="Nome da empresa")
    parser.add_argument("--link", default="", help="Link opcional da vaga")
    parser.add_argument("--esperar", type=int, default=20, help="Tempo de espera para carregar o WhatsApp Web")
    parser.add_argument("--fechar-aba", action="store_true", help="Fecha a aba após o envio")
    args = parser.parse_args()

    try:
        numero = validar_numero(args.numero)
        mensagem = montar_mensagem(args.nome, args.vaga, args.empresa, args.link or None)
        enviar_whatsapp(numero, mensagem, esperar=args.esperar, fechar_aba=args.fechar_aba)
        print("Mensagem enviada com sucesso no fluxo do WhatsApp Web.")
        return 0
    except Exception as exc:
        logger.exception("Falha no envio de WhatsApp: %s", exc)
        print(f"Erro ao enviar WhatsApp: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())