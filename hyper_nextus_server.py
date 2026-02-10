"""
################################################################################
# THALOS PRIME | HYPER NEXTUS SERVER                                          #
# [HIGH-VELOCITY TELEMETRY CONDUIT]                                           #
################################################################################
"""

import asyncio
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - [HYPER-NEXTUS] - %(message)s"
)
logger = logging.getLogger(__name__)


class HyperNextusProtocol:
    """Manages raw binary streams for zero-latency neural feedback."""

    async def handle_client(self, reader, writer):
        addr = writer.get_extra_info("peername")
        logger.info(f"Neural Conduit opened with {addr}")

        try:
            while True:
                data = await reader.read(1024)
                if not data:
                    break

                # Echo mechanism simulating neural reflex arc
                # In production, this parses Protobuf packets
                writer.write(data)
                await writer.drain()
        except Exception as e:
            logger.error(f"Conduit rupture: {e}")
        finally:
            logger.info(f"Closing conduit with {addr}")
            writer.close()
            await writer.wait_closed()


async def main():
    server = await asyncio.start_server(
        HyperNextusProtocol().handle_client, "127.0.0.1", 5001
    )

    addrs = ", ".join(str(sock.getsockname()) for sock in server.sockets)
    logger.info(f"Hyper Nextus Active on {addrs} (Port 5001)")

    async with server:
        await server.serve_forever()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Hyper Nextus deactivating.")
