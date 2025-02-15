import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-blue-600 text-white py-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold mb-4 font-montserrat">Sobre Nós</h3>
                        <p className="text-sm text-gray-200 font-montserrat">
                            O MetabolicHub é a plataforma definitiva para gerenciamento de saúde
                            metabólica.
                        </p>
                    </div>

                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-4 font-montserrat">Links Rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#features"
                                    className="text-gray-200 hover:text-white transition duration-300 font-montserrat"
                                >
                                    Funcionalidades
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#testimonials"
                                    className="text-gray-200 hover:text-white transition duration-300 font-montserrat"
                                >
                                    Depoimentos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#contact"
                                    className="text-gray-200 hover:text-white transition duration-300 font-montserrat"
                                >
                                    Contato
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center md:text-right">
                        <h3 className="text-xl font-bold mb-4 font-montserrat">Contato</h3>
                        <ul className="text-sm text-gray-200 space-y-2 font-montserrat">
                            <li>Email: hubmetabolic@gmail.com</li>
                            <li>Telefone: (38) 99743-7134</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-500 mt-8 pt-6 text-center">
                    <p className="text-sm text-gray-200 font-montserrat">
                        &copy; {new Date().getFullYear()} MetabolicHub. Todos os direitos
                        reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
