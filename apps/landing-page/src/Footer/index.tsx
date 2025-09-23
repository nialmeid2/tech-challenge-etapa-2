import Container from "@repo/ui/components/Container";


export default function HomeFooter() {
    return <footer className="bg-black py-[2.5em] w-[100%]">
        <Container className="text-white flex justify-between max-[671px]:flex-col max-[671px]:px-[3em]">
            <ul className="flex flex-col justify-between gap-[1em] max-[671px]:mb-[2em]">
                <li><h2 className="font-bold">Serviços</h2></li>
                <li>Conta Corrente</li>
                <li>Conta PJ</li>
                <li>Cartão de crédito</li>
            </ul>
            <ul className="flex flex-col justify-between gap-[1em] max-[671px]:mb-[2em]">
                <li><h2 className="font-bold">Contato</h2></li>
                <li>0800 004 250 08</li>
                <li>meajuda@bytebank.com.br</li>
                <li>ouvidoria@bytebank.com.br</li>
            </ul>
            <ul className="flex flex-col justify-between gap-[1em] text-center max-[671px]:text-left">
                <li><h2 className="font-bold">Desenvolvido por Alura</h2></li>
                <li><img src="/home/brand_white.svg" alt="Byte Bank" className="mx-auto max-[671px]:mx-[0]" /></li>
                <li className="flex justify-center gap-[1.5ch] max-[671px]:justify-start">
                    <img src="/home/instagram.svg" alt="Instagram da Bytebank" className="h-[2.5em]" />
                    <img src="/home/whatsapp.svg" alt="Whatsapp da Bytebank" className="h-[2.5em]" />
                    <img src="/home/youtube.svg" alt="Canal do youtube da Bytebank" className="h-[2.5em]" />
                </li>
            </ul>
        </Container>
    </footer>
}