import { useCallback } from "react";

const useWhatsAppOrder = (phoneNumber) => {
  const sendOrderToWhatsApp = useCallback(
    (products, quantities) => {
      const totalHarga = products.reduce(
        (total, product) =>
          total + Number(product.price) * (quantities[product.id] || 1),
        0
      );

      let message = `Halo, saya ingin memesan produk berikut:\n\n`;

      products.forEach((product, index) => {
        const quantity = quantities[product.id] || 1;
        message += `${index + 1}. ${product.name} - ${quantity} pcs - Rp ${(
          Number(product.price) * quantity
        ).toLocaleString("id-ID")}\n`;
      });

      message += `\nTotal Harga: Rp ${totalHarga.toLocaleString(
        "id-ID"
      )}\n\nMohon konfirmasi pesanan saya. Terima kasih!`;

      const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappURL, "_blank");
    },
    [phoneNumber]
  );

  return sendOrderToWhatsApp;
};

export default useWhatsAppOrder;
