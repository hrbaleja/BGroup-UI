
import { logoBase64 } from "./logo";

const APPNAME = import.meta.env.VITE_APP_NAME;


export function addPDFHeader(doc) {
    const logoWidth = 20;
    const logoHeight = 20;
    doc.addImage(logoBase64, 'PNG', 2, 2, logoWidth, logoHeight);

    doc.setFontSize(26);
    doc.setTextColor('#FF6200');
    doc.setFont('Helvetica', 'bold');
    const companyText = APPNAME;
    const textWidth = doc.getTextWidth(companyText);
    const xCenter = (doc.internal.pageSize.getWidth() - textWidth) / 2.5;
    doc.text(companyText, xCenter, 12);

    doc.setFontSize(12);
    doc.setTextColor('#777');
    doc.setFont('Helvetica', 'normal');
    const taglineText = '';
    const taglineWidth = doc.getTextWidth(taglineText);
    const taglineXCenter = (doc.internal.pageSize.getWidth() - taglineWidth) / 2.5;
    doc.text(taglineText, taglineXCenter, 17);


    // Add contact information
    // const contactInfo = 'Contact: (123) 456-7890          Website: www.example.com          Email: info@example.com';

    // doc.setFontSize(10);
    // doc.setTextColor('#000');

    // // Add clickable contact link
    // const contactX = logoWidth + 4; // Starting X position after logo
    // const contactY = 22; // Y position for the contact info
    // doc.text(contactInfo, contactX, contactY);

    // // Adding links for the contact, website, and email
    // const contactLink = 'tel:1234567890';
    // const websiteLink = 'http://www.example.com';
    // const emailLink = 'mailto:info@example.com';

    // // Add clickable links (calculating widths accordingly)
    // doc.link(contactX, contactY - 10, doc.getTextWidth('Contact: (123) 456-7890'), 10, { url: contactLink });
    // doc.link(contactX + doc.getTextWidth('Contact: (123) 456-7890     |     '), contactY - 10, doc.getTextWidth('Website: www.example.com'), 10, { url: websiteLink });
    // doc.link(contactX + doc.getTextWidth('Contact: (123) 456-7890     |     Website: www.example.com     |     '), contactY - 10, doc.getTextWidth('Email: info@example.com'), 10, { url: emailLink });
    // const contactItems = [
    //     { icon: { base64: logoBase64, width: 5, height: 5 }, text: '(123) 456-7890', link: 'tel:1234567890' },
    //     { icon: { base64: logoBase64, width: 5, height: 5 }, text: 'www.example.com', link: 'http://www.example.com' },
    //     { icon: { base64: logoBase64, width: 5, height: 5 }, text: 'info@example.com', link: 'mailto:info@example.com' }
    // ];

    // let currentX = 22;
    // const itemY = 23;

    // contactItems.forEach((item) => {
    //     doc.setFontSize(12); // Contact text size
    //     doc.setTextColor('#000'); // Default text color
    //     doc.text(item.text, currentX, itemY);
    //     // // Draw icon
    //     // doc.addImage(item.icon.base64, 'PNG', currentX, itemY - 3.5, item.icon.width, item.icon.height);
    //     // currentX += item.icon.width + 3;

    //     // Add text
    //     const textWidths = doc.getTextWidth(item.text);
    //     doc.link(currentX, itemY - 8, textWidths, 10, { url: item.link }); // Adjust link position
    //     currentX += textWidths + 15; // Add space between items
    // });


    // Geometric design (right-side shapes)
    doc.setFillColor('#FF6200');
    doc.triangle(150, 0, 180, 0, 165, 24, 'F');

    doc.setFillColor('#1a3352');
    doc.triangle(170, 0, 200, 0, 185, 24, 'F');

    doc.setFillColor('#FF6200');
    doc.triangle(190, 0, 230, 0, 205, 24, 'F');

    // Add line separator under the header
    doc.setLineWidth(0.2);
    doc.setDrawColor(255, 98, 0);
    doc.line(0, 25, 250, 25);

    doc.setTextColor(0, 0, 0);
}