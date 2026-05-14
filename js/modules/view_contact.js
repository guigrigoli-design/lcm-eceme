/**
 * MODULE: Contato
 */
function renderContact(app) {
    const { lang, menuLabels } = app;

    return `
        <div class="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
            <div class="bg-white p-10 rounded shadow-lg border-l-8 border-[#1e3a2c]">
                <h2 class="text-3xl font-bold text-[#1e3a2c] uppercase mb-10">${menuLabels[lang].contact}</h2>
                <div class="space-y-8">
                    <div class="flex items-center text-gray-800">
                        <i class="fa-solid fa-envelope text-[#c5a059] w-12 text-2xl"></i>
                        <div>
                            <p class="text-[10px] font-bold uppercase text-gray-400">E-mail Institucional</p>
                            <p class="font-bold">lcm.eceme@eb.mil.br</p>
                        </div>
                    </div>
                    <div class="flex items-center text-gray-800">
                        <i class="fa-solid fa-location-dot text-[#c5a059] w-12 text-2xl"></i>
                        <div>
                            <p class="text-[10px] font-bold uppercase text-gray-400">Endereço</p>
                            <p class="font-bold">Praça General Tibúrcio, 125, Urca, Rio de Janeiro - RJ</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex space-x-10 mt-12 border-t pt-10">
                    <a href="https://instagram.com/lcmeceme" target="_blank" class="text-4xl text-[#1e3a2c] hover:text-[#c5a059] transition"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://linkedin.com/company/lcmeceme" target="_blank" class="text-4xl text-[#1e3a2c] hover:text-[#c5a059] transition"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="https://youtube.com/@LaboratórioCiênciasMilitares" target="_blank" class="text-4xl text-[#1e3a2c] hover:text-[#c5a059] transition"><i class="fa-brands fa-youtube"></i></a>
                </div>
            </div>
            <div class="h-[450px] rounded shadow-2xl overflow-hidden border-2 border-white">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.5412497672!2d-43.1673!3d-22.9554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x99a07f9f9f9f9f%3A0x9f9f9f9f9f9f9f9f!2sECEME!5e0!3m2!1spt-BR!2sbr!4v1620000000000" 
                        width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
        </div>`;
}
