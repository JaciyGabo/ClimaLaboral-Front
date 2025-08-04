import { QRCodeSVG } from 'qrcode.react';
import { BarChart3, Users, MessageCircle, } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

// Componente individual de card para cada área
const AreaCard = ({ nombreArea, nombreEmpresa, onGenerarAnalisis }) => {
    const urlFormulario = `http://climalaboral/formulario?empresa=${encodeURIComponent(nombreEmpresa)}&area=${encodeURIComponent(nombreArea)}`;

    const handleCompartirWhatsApp = async () => {
        try {
            // Crear un canvas para generar la imagen del QR
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const qrSize = 300;
            canvas.width = qrSize;
            canvas.height = qrSize;

            // Crear el QR como imagen
            const QRCode = await import('qrcode');
            await QRCode.toCanvas(canvas, urlFormulario, {
                width: qrSize,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            // Convertir canvas a blob
            canvas.toBlob(async (blob) => {
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'qr-code.png', { type: 'image/png' })] })) {
                    // Usar Web Share API si está disponible
                    const file = new File([blob], `QR-${nombreArea}.png`, { type: 'image/png' });
                    await navigator.share({
                        title: `Formulario Clima Laboral - ${nombreArea}`,
                        text: `¡Hola! Te invito a participar en la evaluación del clima laboral del área de *${nombreArea}*. Escanea este código QR:`,
                        files: [file]
                    });
                } else {
                    // Fallback: crear URL temporal y abrir WhatsApp Web
                    const imageUrl = URL.createObjectURL(blob);
                    const mensaje = `¡Hola! Te invito a participar en la evaluación del clima laboral del área de *${nombreArea}*. Escanea el código QR que te comparto para acceder al formulario.`;
                    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

                    // Abrir WhatsApp y mostrar instrucciones para compartir la imagen
                    window.open(urlWhatsApp, '_blank');

                    // Crear enlace temporal para descargar la imagen
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = `QR-${nombreArea}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Limpiar URL temporal
                    setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);

                    alert('Se abrió WhatsApp y se descargó el código QR. Comparte la imagen descargada en el chat.');
                }
            }, 'image/png');

        } catch (error) {
            console.error('Error al compartir QR:', error);
            // Fallback: compartir solo el enlace
            const mensaje = `¡Hola! Te invito a participar en la evaluación del clima laboral del área de *${nombreArea}*. Accede al formulario desde este enlace: ${urlFormulario}`;
            const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
            window.open(urlWhatsApp, '_blank');
        }
    };

    return (
        <div className="bg-[#219EBC] backdrop-blur-lg !rounded-3xl !shadow-lg !border !border-gray-200 !p-6 hover:!shadow-xl !transition-shadow !duration-300">
            {/* Header con nombre del área */}
            <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-2">
                    <Users strokeWidth={3} className="w-5 h-5 text-[#FEB703]" />
                    <h3 className="text-xl font-bold text-white text-center">
                        {nombreArea}
                    </h3>
                </div>
            </div>

            {/* Código QR centrado */}
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-cyan-900/20 backdrop-blur-sm rounded-lg">
                    <QRCodeSVG
                        value={urlFormulario}
                        size={160}
                        level="M"
                        includeMargin={true}
                        className="drop-shadow-sm"
                    />
                </div>
            </div>

            {/* <div className="mb-4">
                <p className="text-xs text-gray-500 text-center break-all">
                    {urlFormulario}
                </p>
            </div> */}

            {/* Botones de acción */}
            <div className="flex justify-center space-x-4">
                {/* Botón WhatsApp con ancho automático */}
                <button
                    onClick={handleCompartirWhatsApp}
                    className="!bg-white hover:bg-[#219EBC] text-green-600 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                    <SiWhatsapp className="w-5 h-5" strokeWidth={.5} />
                </button>

                {/* Botón que ocupa todo el espacio restante */}
                <button
                    onClick={() => onGenerarAnalisis(nombreArea)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                    <BarChart3 className="w-5 h-5" strokeWidth={3} />
                    <span>Generar Análisis</span>
                </button>
            </div>

        </div>
    );
};

export default AreaCard;
