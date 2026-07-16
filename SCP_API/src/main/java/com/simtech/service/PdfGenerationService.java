package com.simtech.service;

import java.io.ByteArrayOutputStream;
import com.simtech.constants.ApplicationConstants;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;
import java.awt.Color;
import org.springframework.core.io.ClassPathResource;
import java.text.NumberFormat;
import java.util.Locale;

@Service
public class PdfGenerationService {
    
    public byte[] generatePaymentInvoice(String userName, String emailId, 
    String invoiceNumber, String transactionId,
    double amount, LocalDate paymentDate, String phone,
    String city, String state, String paymentMethod) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);
            
            // Set all margins to 0
            document.setMargins(16, 16, 16, 16);
            
            document.open();

            try {
                // Create the image instance using ClassPathResource instead of direct file path
                ClassPathResource resource = new ClassPathResource("images/techcell-logo-beta-5.png");
                byte[] imageData = null;
                try {
                    imageData = new byte[resource.getInputStream().available()];
                    resource.getInputStream().read(imageData);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                
                if (imageData != null) {
                    Image logo = Image.getInstance(imageData);
                    
                    // Set width to 30 and preserve aspect ratio
                    float originalWidth = logo.getWidth();
                    float originalHeight = logo.getHeight();
                    float aspectRatio = originalHeight / originalWidth;
                    float newWidth = 40;
                    float newHeight = newWidth * aspectRatio;
                    
                    logo.scaleToFit(newWidth, newHeight);
                    
                    // Position from top and left
                    float xPosition = document.leftMargin() + 4;
                    float yPosition = document.getPageSize().getHeight() - document.topMargin() - 4 - newHeight;
                    
                    logo.setAbsolutePosition(xPosition, yPosition);
                    
                    // Add the image to direct content
                    PdfContentByte cb = writer.getDirectContent();
                    cb.addImage(logo);
                }
            } catch (Exception e) {
                e.printStackTrace();
                // Handle the error appropriately
            }
            
            // Define text color #525252 (dark gray)
            Color textColor = new Color(82, 82, 82);
            
            // Define neutral dark color #262626
            Color neutralDark = new Color(23, 23, 23);

            // Get the direct content
            PdfContentByte cb = writer.getDirectContent();

            // Set border color
            cb.setColorStroke(textColor);

            // Calculate dimensions for rounded border
            float width = document.getPageSize().getWidth() - document.leftMargin();
            float height = document.getPageSize().getHeight() - document.topMargin();
            float x = document.leftMargin() / 2;
            float y = document.bottomMargin() / 2;

            // Define the radius for rounded corners
            float radius = 4f;

            // Begin drawing the path for rounded border
            cb.saveState();
            // Top-left corner
            cb.arc(x, y + height - 2*radius, x + 2*radius, y + height, 90, 90);
            // Top edge
            cb.moveTo(x + radius, y + height);
            cb.lineTo(x + width - radius, y + height);
            // Top-right corner
            cb.arc(x + width - 2*radius, y + height - 2*radius, x + width, y + height, 0, 90);
            // Right edge
            cb.moveTo(x + width, y + height - radius);
            cb.lineTo(x + width, y + radius);
            // Bottom-right corner
            cb.arc(x + width - 2*radius, y, x + width, y + 2*radius, 270, 90);
            // Bottom edge
            cb.moveTo(x + width - radius, y);
            cb.lineTo(x + radius, y);
            // Bottom-left corner
            cb.arc(x, y, x + 2*radius, y + 2*radius, 180, 90);
            // Left edge
            cb.moveTo(x, y + radius);
            cb.lineTo(x, y + height - radius);
            // Stroke the path
            cb.stroke();
            cb.restoreState();

            // Create font for "Receipt" heading 
            Font receiptFont = FontFactory.getFont("Arial", 12, Font.BOLD);
            receiptFont.setColor(Color.BLACK);
            receiptFont.setStyle(Font.UNDERLINE);

            // Create a separate font for spacing (without underline)
            Font spacingFont = FontFactory.getFont("Arial", 12);

            // Add some initial spacing before the heading
            document.add(new Paragraph(" ", spacingFont));
            
            // Create a paragraph for the heading
            Paragraph receiptHeading = new Paragraph("Invoice", receiptFont);
            receiptHeading.setAlignment(Element.ALIGN_CENTER);
            receiptHeading.setSpacingAfter(60);   // Increase space after the heading

            // Add the heading to the document
            document.add(receiptHeading);
            
            // Create font with size 10 and specified color
            Font regularFont = FontFactory.getFont("Arial", 10);
            regularFont.setColor(textColor);
            
            // Create font for dynamic values
            Font dynamicFont = FontFactory.getFont("Arial", 10);
            dynamicFont.setColor(neutralDark);
            
            Font tableFont = FontFactory.getFont("Arial", 8);
            tableFont.setColor(textColor);
            
            // Create font for dynamic table values
            Font tableDynamicFont = FontFactory.getFont("Arial", 8);
            tableDynamicFont.setColor(neutralDark);
            
            // Create a table for layout (2 columns)
            PdfPTable mainTable = new PdfPTable(2);
            mainTable.setWidthPercentage(100);
            
            // First column - Company details
            PdfPCell leftCell = new PdfPCell();
            leftCell.setBorder(Rectangle.NO_BORDER);
            
            Paragraph companyName = new Paragraph("Qbic Catalyst Partners Pvt. Ltd.", regularFont);
            Paragraph address1 = new Paragraph("2nd Floor, #427, 2nd Main Road,", regularFont);
            Paragraph address2 = new Paragraph("East of NGEF Layout, Kasturi Nagar,", regularFont);
            Paragraph companyCity = new Paragraph("Bengaluru, Karnataka", regularFont);
            Paragraph companyState = new Paragraph("560043", regularFont);
            Paragraph country = new Paragraph("India", regularFont);
            Paragraph email = new Paragraph(ApplicationConstants.INVOICE_EMAIL, regularFont);
            Paragraph gst = new Paragraph("GST " + ApplicationConstants.GSTCODE, regularFont);
            
            leftCell.addElement(companyName);
            leftCell.addElement(address1);
            leftCell.addElement(address2);
            leftCell.addElement(companyCity);
            leftCell.addElement(companyState);
            leftCell.addElement(country);
            leftCell.addElement(email);
            leftCell.addElement(gst);
            
            // Second column - Invoice details
            PdfPCell rightCell = new PdfPCell();
            rightCell.setBorder(Rectangle.NO_BORDER);
            
            // For each row in the right side, create a nested table with 2 columns
            PdfPTable invoiceTable = new PdfPTable(2);
            invoiceTable.setWidthPercentage(100);
            
          
            
            // Format the date
            String formattedDate = paymentDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            
            // Row 1: Invoice Number
            PdfPCell labelCell1 = new PdfPCell(new Phrase("Invoice No :", regularFont));
            PdfPCell valueCell1 = new PdfPCell(new Phrase(invoiceNumber, dynamicFont));
            labelCell1.setBorder(Rectangle.NO_BORDER);
            valueCell1.setBorder(Rectangle.NO_BORDER);
            valueCell1.setHorizontalAlignment(Element.ALIGN_RIGHT);
            valueCell1.setVerticalAlignment(Element.ALIGN_MIDDLE);
            invoiceTable.addCell(labelCell1);
            invoiceTable.addCell(valueCell1);
            
            // Row 2: Transaction Reference Number
            PdfPCell labelCell2 = new PdfPCell(new Phrase("Transaction Reference No :", regularFont));
            PdfPCell valueCell2 = new PdfPCell(new Phrase(transactionId, dynamicFont));
            labelCell2.setBorder(Rectangle.NO_BORDER);
            valueCell2.setBorder(Rectangle.NO_BORDER);
            valueCell2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            valueCell2.setVerticalAlignment(Element.ALIGN_MIDDLE);
            invoiceTable.addCell(labelCell2);
            invoiceTable.addCell(valueCell2);
            
            // Row 3: Date Paid
            PdfPCell labelCell3 = new PdfPCell(new Phrase("Date Paid :", regularFont));
            PdfPCell valueCell3 = new PdfPCell(new Phrase(formattedDate, dynamicFont));
            labelCell3.setBorder(Rectangle.NO_BORDER);
            valueCell3.setBorder(Rectangle.NO_BORDER);
            valueCell3.setHorizontalAlignment(Element.ALIGN_RIGHT);
            valueCell3.setVerticalAlignment(Element.ALIGN_MIDDLE);
            invoiceTable.addCell(labelCell3);
            invoiceTable.addCell(valueCell3);
            
            // Row 4: Payment Method
            PdfPCell labelCell4 = new PdfPCell(new Phrase("Payment Method :", regularFont));
            PdfPCell valueCell4 = new PdfPCell(new Phrase(paymentMethod, dynamicFont));
            labelCell4.setBorder(Rectangle.NO_BORDER);
            valueCell4.setBorder(Rectangle.NO_BORDER);
            valueCell4.setHorizontalAlignment(Element.ALIGN_RIGHT);
            valueCell4.setVerticalAlignment(Element.ALIGN_MIDDLE);
            invoiceTable.addCell(labelCell4);
            invoiceTable.addCell(valueCell4);
            
            rightCell.addElement(invoiceTable);
            
            // Add cells to main table
            mainTable.addCell(leftCell);
            mainTable.addCell(rightCell);
            
            // Add main table to document
            document.add(mainTable);
            
            // Add some spacing
            document.add(new Paragraph(" ", regularFont));
            document.add(new Paragraph(" ", regularFont));
            
            // Add the customer details section (right-aligned)
            PdfPTable customerTable = new PdfPTable(1);
            customerTable.setWidthPercentage(100);
            
            PdfPCell customerCell = new PdfPCell();
            customerCell.setBorder(Rectangle.NO_BORDER);
            customerCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            
            // Create right-aligned paragraphs for customer details with dynamic data
            Paragraph customerName = new Paragraph(userName.toUpperCase(), dynamicFont);
            Paragraph customerPhone = new Paragraph("+91 " + phone, dynamicFont);
            Paragraph customerEmail = new Paragraph(emailId, dynamicFont);
            Paragraph customerCity = new Paragraph(city, dynamicFont);
            Paragraph customerState = new Paragraph(state, dynamicFont);
            
            // Set alignment to right for each paragraph
            customerName.setAlignment(Element.ALIGN_RIGHT);
            customerPhone.setAlignment(Element.ALIGN_RIGHT);
            customerEmail.setAlignment(Element.ALIGN_RIGHT);
            customerCity.setAlignment(Element.ALIGN_RIGHT);
            customerState.setAlignment(Element.ALIGN_RIGHT);
            
            // Add paragraphs to the cell
            customerCell.addElement(customerName);
            customerCell.addElement(customerPhone);
            customerCell.addElement(customerEmail);
            customerCell.addElement(customerCity);
            customerCell.addElement(customerState);
            
            // Add the cell to the table
            customerTable.addCell(customerCell);
            
            // Add the customer table to the document
            document.add(customerTable);

            // Add some spacing
            document.add(new Paragraph(" ", regularFont));
            document.add(new Paragraph(" ", regularFont));

            // Define a light gray background color that matches #F6F6F7
            Color lightGrayBg = new Color(246, 246, 247);

            // Create the product details table header
            // Main table with 3 columns: 60% for product info, 30% for tax info, 10% for total
            PdfPTable productHeaderTable = new PdfPTable(new float[]{60f, 30f, 10f});
            productHeaderTable.setWidthPercentage(100);

            // 1. First column - Product description and details (60%)
            PdfPTable productDetailsTable = new PdfPTable(6);
            productDetailsTable.setWidthPercentage(100);

            // Add headers for product details
            String[] productHeaders = {"Product Description", "SAC Code", "Qty", "Price", "Discount", "Taxable Amount"};
            for (String header : productHeaders) {
                PdfPCell cell = new PdfPCell(new Phrase(header, tableFont));
                cell.setBackgroundColor(lightGrayBg);
                cell.setPadding(5);
                cell.setBorder(Rectangle.BOX);
                cell.setBorderColor(textColor);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                productDetailsTable.addCell(cell);
            }

            // Create the cell for the product details table
            PdfPCell productDetailsCell = new PdfPCell(productDetailsTable);
            productDetailsCell.setBorder(Rectangle.BOX);
            productDetailsCell.setBorderColor(textColor);
            productDetailsCell.setPadding(0);

            // 2. Second column - Tax information (30%)
            PdfPTable taxTable = new PdfPTable(state.equalsIgnoreCase("karnataka") ? 2 : 1);
            taxTable.setWidthPercentage(100);

            if (state.equalsIgnoreCase("karnataka")) {
                // CGST section
                PdfPTable cgstTable = new PdfPTable(2);
                cgstTable.setWidthPercentage(100);

                // CGST Header
                PdfPCell cgstHeaderCell = new PdfPCell(new Phrase("CGST", tableFont));
                cgstHeaderCell.setBackgroundColor(lightGrayBg);
                cgstHeaderCell.setColspan(2);
                cgstHeaderCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cgstHeaderCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cgstHeaderCell.setBorder(Rectangle.BOX);
                cgstHeaderCell.setBorderColor(textColor);
                cgstTable.addCell(cgstHeaderCell);

                // CGST Rate and Amount
                PdfPCell cgstRateCell = new PdfPCell(new Phrase("Rate", tableFont));
                cgstRateCell.setBackgroundColor(lightGrayBg);
                cgstRateCell.setBorder(Rectangle.RIGHT | Rectangle.BOTTOM);
                cgstRateCell.setBorderColor(textColor);
                cgstRateCell.setPadding(5);
                cgstTable.addCell(cgstRateCell);

                PdfPCell cgstAmountCell = new PdfPCell(new Phrase("Amount", tableFont));
                cgstAmountCell.setBackgroundColor(lightGrayBg);
                cgstAmountCell.setBorder(Rectangle.BOTTOM | Rectangle.RIGHT);
                cgstAmountCell.setBorderColor(textColor);
                cgstAmountCell.setPadding(5);
                cgstTable.addCell(cgstAmountCell);

                // SGST section
                PdfPTable sgstTable = new PdfPTable(2);
                sgstTable.setWidthPercentage(100);

                // SGST Header
                PdfPCell sgstHeaderCell = new PdfPCell(new Phrase("SGST", tableFont));
                sgstHeaderCell.setBackgroundColor(lightGrayBg);
                sgstHeaderCell.setColspan(2);
                sgstHeaderCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                sgstHeaderCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                sgstHeaderCell.setBorder(Rectangle.BOX);
                sgstHeaderCell.setBorderColor(textColor);
                sgstTable.addCell(sgstHeaderCell);

                // SGST Rate and Amount
                PdfPCell sgstRateCell = new PdfPCell(new Phrase("Rate", tableFont));
                sgstRateCell.setBackgroundColor(lightGrayBg);
                sgstRateCell.setBorder(Rectangle.RIGHT | Rectangle.BOTTOM);
                sgstRateCell.setBorderColor(textColor);
                sgstRateCell.setPadding(5);
                sgstTable.addCell(sgstRateCell);

                PdfPCell sgstAmountCell = new PdfPCell(new Phrase("Amount", tableFont));
                sgstAmountCell.setBackgroundColor(lightGrayBg);
                sgstAmountCell.setBorder(Rectangle.BOTTOM);
                sgstAmountCell.setBorderColor(textColor);
                sgstAmountCell.setPadding(5);
                sgstTable.addCell(sgstAmountCell);

                // Create cells for CGST and SGST tables
                PdfPCell cgstCell = new PdfPCell(cgstTable);
                cgstCell.setBorder(Rectangle.LEFT | Rectangle.TOP | Rectangle.BOTTOM);
                cgstCell.setBorderColor(textColor);
                cgstCell.setPadding(0);

                PdfPCell sgstCell = new PdfPCell(sgstTable);
                sgstCell.setBorder(Rectangle.RIGHT | Rectangle.TOP | Rectangle.BOTTOM);
                sgstCell.setBorderColor(textColor);
                sgstCell.setPadding(0);

                // Add CGST and SGST tables to tax table
                taxTable.addCell(cgstCell);
                taxTable.addCell(sgstCell);
            } else {
                // IGST section
                PdfPTable igstTable = new PdfPTable(2);
                igstTable.setWidthPercentage(100);

                // IGST Header
                PdfPCell igstHeaderCell = new PdfPCell(new Phrase("IGST", tableFont));
                igstHeaderCell.setBackgroundColor(lightGrayBg);
                igstHeaderCell.setColspan(2);
                igstHeaderCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                igstHeaderCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                igstHeaderCell.setBorder(Rectangle.BOX);
                igstHeaderCell.setBorderColor(textColor);
                igstTable.addCell(igstHeaderCell);

                // IGST Rate and Amount
                PdfPCell igstRateCell = new PdfPCell(new Phrase("Rate", tableFont));
                igstRateCell.setBackgroundColor(lightGrayBg);
                igstRateCell.setBorder(Rectangle.RIGHT | Rectangle.BOTTOM);
                igstRateCell.setBorderColor(textColor);
                igstRateCell.setPadding(5);
                igstTable.addCell(igstRateCell);

                PdfPCell igstAmountCell = new PdfPCell(new Phrase("Amount", tableFont));
                igstAmountCell.setBackgroundColor(lightGrayBg);
                igstAmountCell.setBorder(Rectangle.BOTTOM);
                igstAmountCell.setBorderColor(textColor);
                igstAmountCell.setPadding(5);
                igstTable.addCell(igstAmountCell);

                // Create cell for IGST table
                PdfPCell igstCell = new PdfPCell(igstTable);
                igstCell.setBorder(Rectangle.LEFT | Rectangle.RIGHT | Rectangle.TOP | Rectangle.BOTTOM);
                igstCell.setBorderColor(textColor);
                igstCell.setPadding(0);

                // Add IGST table to tax table
                taxTable.addCell(igstCell);
            }

            // Create the cell for the tax table
            PdfPCell taxTableCell = new PdfPCell(taxTable);
            taxTableCell.setBorder(Rectangle.NO_BORDER);
            taxTableCell.setPadding(0);

            // 3. Third column - Total (10%)
            PdfPCell totalCell = new PdfPCell(new Phrase("Total", tableFont));
            totalCell.setBackgroundColor(lightGrayBg);
            totalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            totalCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            totalCell.setBorder(Rectangle.BOX);
            totalCell.setBorderColor(textColor);

            // Add all three columns to the product header table
            productHeaderTable.addCell(productDetailsCell);
            productHeaderTable.addCell(taxTableCell);
            productHeaderTable.addCell(totalCell);

            // Add the product header table to the document
            document.add(productHeaderTable);

            // Calculate tax amounts once and reuse
            double cgstAmount = 0;
            double sgstAmount = 0;
            double igstAmount = 0;
            double totalAmountWithTax;
            
            if (state.equalsIgnoreCase("karnataka")) {
                cgstAmount = (ApplicationConstants.CGST / 100) * amount;
                sgstAmount = (ApplicationConstants.SGST / 100) * amount;
                totalAmountWithTax = amount + cgstAmount + sgstAmount;
            } else {
                igstAmount = (ApplicationConstants.IGST / 100) * amount;
                totalAmountWithTax = amount + igstAmount;
            }

            // Format amount with 2 decimal places
            String formattedAmount = String.format("%.2f", amount);

            // Create a data row for the product
            PdfPTable productDataTable = new PdfPTable(new float[]{60f, 30f, 10f});
            productDataTable.setWidthPercentage(100);

            // 1. First column - Product details (60%)
            PdfPTable productDetailsDataTable = new PdfPTable(6);
            productDetailsDataTable.setWidthPercentage(100);

            // Product data cells with dynamic amount
            String[] productData = {
                "Registration Fee",
                "999512",
                "1",
                formattedAmount,
                "0",
                formattedAmount
            };

            // Add product details data
            for (int i = 0; i < productData.length; i++) {
                PdfPCell cell = new PdfPCell(new Phrase(productData[i], 
                    i == 0 ? tableFont : tableDynamicFont)); // Use regular font for "Registration Fee", dynamic font for others
                cell.setPadding(5);
                cell.setPaddingTop(8);
                cell.setPaddingBottom(8);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                // Only add right border except for the last cell which will be part of the table border
                cell.setBorder(i < productData.length - 1 ? Rectangle.RIGHT : Rectangle.NO_BORDER);
                cell.setBorderColor(textColor);
                productDetailsDataTable.addCell(cell);
            }

            // Create cell for the product details data
            PdfPCell productDetailsDataCell = new PdfPCell(productDetailsDataTable);
            productDetailsDataCell.setBorder(Rectangle.LEFT | Rectangle.BOTTOM);
            productDetailsDataCell.setBorderColor(textColor);
            productDetailsDataCell.setPadding(0);

            // 2. Second column - Tax data (30%)
            PdfPTable taxDataTable = new PdfPTable(state.equalsIgnoreCase("karnataka") ? 2 : 1);
            taxDataTable.setWidthPercentage(100);

            if (state.equalsIgnoreCase("karnataka")) {
                // CGST data section
                PdfPTable cgstDataTable = new PdfPTable(2);
                cgstDataTable.setWidthPercentage(100);

                // CGST Rate and Amount data
                PdfPCell cgstRateDataCell = new PdfPCell(
                    new Phrase(String.valueOf(ApplicationConstants.CGST) + "%", tableDynamicFont)
                );
                cgstRateDataCell.setBorder(Rectangle.RIGHT);
                cgstRateDataCell.setBorderColor(textColor);
                cgstRateDataCell.setPadding(5);
                cgstRateDataCell.setPaddingTop(8);
                cgstRateDataCell.setPaddingBottom(8);
                cgstRateDataCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cgstRateDataCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cgstDataTable.addCell(cgstRateDataCell);

                // CGST amount cell
                PdfPCell cgstAmountCell = new PdfPCell(new Phrase(String.format("%.2f", cgstAmount), tableDynamicFont));
                cgstAmountCell.setBorder(Rectangle.RIGHT);
                cgstAmountCell.setBorderColor(textColor);
                cgstAmountCell.setPadding(5);
                cgstAmountCell.setPaddingTop(8);
                cgstAmountCell.setPaddingBottom(8);
                cgstAmountCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cgstAmountCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                cgstDataTable.addCell(cgstAmountCell);

                // SGST data section
                PdfPTable sgstDataTable = new PdfPTable(2);
                sgstDataTable.setWidthPercentage(100);

                // SGST Rate and Amount data
                PdfPCell sgstRateDataCell = new PdfPCell(
                    new Phrase(String.valueOf(ApplicationConstants.SGST) + "%", tableDynamicFont)
                );
                sgstRateDataCell.setBorder(Rectangle.RIGHT);
                sgstRateDataCell.setBorderColor(textColor);
                sgstRateDataCell.setPadding(5);
                sgstRateDataCell.setPaddingTop(8);
                sgstRateDataCell.setPaddingBottom(8);
                sgstRateDataCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                sgstRateDataCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                sgstDataTable.addCell(sgstRateDataCell);

                // SGST amount cell
                PdfPCell sgstAmountCell = new PdfPCell(new Phrase(String.format("%.2f", sgstAmount), tableDynamicFont));
                sgstAmountCell.setBorder(Rectangle.NO_BORDER);
                sgstAmountCell.setPadding(5);
                sgstAmountCell.setPaddingTop(8);
                sgstAmountCell.setPaddingBottom(8);
                sgstAmountCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                sgstAmountCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                sgstDataTable.addCell(sgstAmountCell);

                // Create cells for CGST and SGST data tables
                PdfPCell cgstDataCell = new PdfPCell(cgstDataTable);
                cgstDataCell.setBorder(Rectangle.LEFT | Rectangle.BOTTOM);
                cgstDataCell.setBorderColor(textColor);
                cgstDataCell.setPadding(0);

                PdfPCell sgstDataCell = new PdfPCell(sgstDataTable);
                sgstDataCell.setBorder(Rectangle.RIGHT | Rectangle.BOTTOM);
                sgstDataCell.setBorderColor(textColor);
                sgstDataCell.setPadding(0);

                // Add CGST and SGST data tables to tax data table
                taxDataTable.addCell(cgstDataCell);
                taxDataTable.addCell(sgstDataCell);
            } else {
                // IGST data section
                PdfPTable igstDataTable = new PdfPTable(2);
                igstDataTable.setWidthPercentage(100);

                // IGST Rate and Amount data
                PdfPCell igstRateDataCell = new PdfPCell(
                    new Phrase(String.valueOf(ApplicationConstants.IGST) + "%", tableDynamicFont)
                );
                igstRateDataCell.setBorder(Rectangle.RIGHT);
                igstRateDataCell.setBorderColor(textColor);
                igstRateDataCell.setPadding(5);
                igstRateDataCell.setPaddingTop(8);
                igstRateDataCell.setPaddingBottom(8);
                igstRateDataCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                igstRateDataCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                igstDataTable.addCell(igstRateDataCell);

                // IGST amount cell
                PdfPCell igstAmountCell = new PdfPCell(new Phrase(String.format("%.2f", igstAmount), tableDynamicFont));
                igstAmountCell.setBorder(Rectangle.NO_BORDER);
                igstAmountCell.setPadding(5);
                igstAmountCell.setPaddingTop(8);
                igstAmountCell.setPaddingBottom(8);
                igstAmountCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                igstAmountCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                igstDataTable.addCell(igstAmountCell);

                // Create cell for IGST data table
                PdfPCell igstDataCell = new PdfPCell(igstDataTable);
                igstDataCell.setBorder(Rectangle.LEFT | Rectangle.RIGHT | Rectangle.BOTTOM);
                igstDataCell.setBorderColor(textColor);
                igstDataCell.setPadding(0);

                // Add IGST data table to tax data table
                taxDataTable.addCell(igstDataCell);
            }

            // Create the cell for the tax data table
            PdfPCell taxDataTableCell = new PdfPCell(taxDataTable);
            taxDataTableCell.setBorder(Rectangle.NO_BORDER);
            taxDataTableCell.setPadding(0);

            // 3. Third column - Total amount (10%)
            PdfPCell totalDataCell = new PdfPCell(
                new Phrase(String.format("%.2f", totalAmountWithTax), tableDynamicFont)
            );
            totalDataCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            totalDataCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            totalDataCell.setBorder(Rectangle.RIGHT | Rectangle.BOTTOM);
            totalDataCell.setBorderColor(textColor);
            totalDataCell.setPadding(5);
            totalDataCell.setPaddingTop(8);
            totalDataCell.setPaddingBottom(8);

            // Add all three columns to the product data table
            productDataTable.addCell(productDetailsDataCell);
            productDataTable.addCell(taxDataTableCell);
            productDataTable.addCell(totalDataCell);

            // Add the product data table to the document
            document.add(productDataTable);

            // Create a total row
            PdfPTable totalRowTable = new PdfPTable(new float[]{60f, 30f, 10f});
            totalRowTable.setWidthPercentage(100);

            // 1. First column - Total description (60%)
            PdfPTable totalDetailsTable = new PdfPTable(6);
            totalDetailsTable.setWidthPercentage(100);

            // Total label spanning 2 columns
            PdfPCell totalLabelCell = new PdfPCell(new Phrase("Total", tableFont));
            totalLabelCell.setColspan(2);  // Spans 2 columns
            totalLabelCell.setBorder(Rectangle.RIGHT);
            totalLabelCell.setBorderColor(textColor);
            totalLabelCell.setPadding(5);
            totalLabelCell.setPaddingTop(8);
            totalLabelCell.setPaddingBottom(8);
            totalLabelCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            totalLabelCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            totalDetailsTable.addCell(totalLabelCell);

            // Total data values with dynamic amount
            String[] totalValues = {"1", formattedAmount, "0", formattedAmount};
            for (int i = 0; i < totalValues.length; i++) {
                PdfPCell cell = new PdfPCell(new Phrase(totalValues[i], tableDynamicFont));
                cell.setPadding(5);
                cell.setPaddingTop(8);
                cell.setPaddingBottom(8);
                cell.setBorder(Rectangle.RIGHT);
                cell.setBorderColor(textColor);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                totalDetailsTable.addCell(cell);
            }

            // Create cell for the total details
            PdfPCell totalDetailsCell = new PdfPCell(totalDetailsTable);
            totalDetailsCell.setBorder(Rectangle.LEFT | Rectangle.BOTTOM);
            totalDetailsCell.setBorderColor(textColor);
            totalDetailsCell.setPadding(0);

            // 2. Second column - Tax totals (30%)
            PdfPTable taxTotalTable = new PdfPTable(state.equalsIgnoreCase("karnataka") ? 2 : 1);
            taxTotalTable.setWidthPercentage(100);

            if (state.equalsIgnoreCase("karnataka")) {
                // CGST total cell
                PdfPCell cgstTotalCell = new PdfPCell(new Phrase(String.format("%.2f", cgstAmount), tableDynamicFont));
                cgstTotalCell.setBorder(Rectangle.RIGHT);
                cgstTotalCell.setBorderColor(textColor);
                cgstTotalCell.setPadding(5);
                cgstTotalCell.setPaddingTop(8);
                cgstTotalCell.setPaddingBottom(8);
                cgstTotalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cgstTotalCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                taxTotalTable.addCell(cgstTotalCell);

                // SGST total cell
                PdfPCell sgstTotalCell = new PdfPCell(new Phrase(String.format("%.2f", sgstAmount), tableDynamicFont));
                sgstTotalCell.setBorder(Rectangle.NO_BORDER);
                sgstTotalCell.setPadding(5);
                sgstTotalCell.setPaddingTop(8);
                sgstTotalCell.setPaddingBottom(8);
                sgstTotalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                sgstTotalCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                taxTotalTable.addCell(sgstTotalCell);
            } else {
                // IGST total cell
                PdfPCell igstTotalCell = new PdfPCell(new Phrase(String.format("%.2f", igstAmount), tableDynamicFont));
                igstTotalCell.setBorder(Rectangle.NO_BORDER);
                igstTotalCell.setPadding(5);
                igstTotalCell.setPaddingTop(8);
                igstTotalCell.setPaddingBottom(8);
                igstTotalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                igstTotalCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                taxTotalTable.addCell(igstTotalCell);
            }

            // Create cells for the tax total sections
            PdfPCell cgstTotalSectionCell = new PdfPCell();
            cgstTotalSectionCell.setBorder(Rectangle.LEFT | Rectangle.BOTTOM);
            cgstTotalSectionCell.setBorderColor(textColor);
            cgstTotalSectionCell.setPadding(0);
            cgstTotalSectionCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cgstTotalSectionCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cgstTotalSectionCell.addElement(new Phrase(String.format("%.2f", cgstAmount), tableDynamicFont));

            PdfPCell sgstTotalSectionCell = new PdfPCell();
            sgstTotalSectionCell.setBorder(Rectangle.RIGHT | Rectangle.BOTTOM);
            sgstTotalSectionCell.setBorderColor(textColor);
            sgstTotalSectionCell.setPadding(0);
            sgstTotalSectionCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            sgstTotalSectionCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            sgstTotalSectionCell.addElement(new Phrase(String.format("%.2f", sgstAmount), tableDynamicFont));

            // Create the cell for the tax total table
            PdfPCell taxTotalTableCell = new PdfPCell(taxTotalTable);
            taxTotalTableCell.setBorder(Rectangle.LEFT | Rectangle.RIGHT | Rectangle.BOTTOM);
            taxTotalTableCell.setBorderColor(textColor);
            taxTotalTableCell.setPadding(0);

            // 3. Third column - Grand total amount (10%)
            PdfPCell grandTotalCell = new PdfPCell(
                new Phrase(String.format("%.2f", totalAmountWithTax), tableDynamicFont)
            );

            grandTotalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            grandTotalCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            grandTotalCell.setBorder(Rectangle.RIGHT | Rectangle.BOTTOM);
            grandTotalCell.setBorderColor(textColor);
            grandTotalCell.setPadding(5);
            grandTotalCell.setPaddingTop(8);
            grandTotalCell.setPaddingBottom(8);

            // Add all three columns to the total row table
            totalRowTable.addCell(totalDetailsCell);
            totalRowTable.addCell(taxTotalTableCell);
            totalRowTable.addCell(grandTotalCell);

            // Add the total row table to the document
            document.add(totalRowTable);

            // Add some spacing
            document.add(new Paragraph(" ", regularFont));

            // Create a right-aligned summary table (40% width)
            PdfPTable summaryTable = new PdfPTable(2); // Two columns: label and amount
            summaryTable.setWidthPercentage(40);
            summaryTable.setHorizontalAlignment(Element.ALIGN_RIGHT); // Right-align the table
            summaryTable.setWidths(new float[]{70f, 30f}); // Label takes 70%, Amount takes 30%

            // Style for the label cells
            PdfPCell labelCell;
            PdfPCell valueCell;

            // Row 1: Total Amount before Tax
            labelCell = new PdfPCell(new Phrase("Total Amount before Tax :", regularFont));
            labelCell.setBorder(Rectangle.NO_BORDER);
            labelCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            summaryTable.addCell(labelCell);

            valueCell = new PdfPCell(
                new Phrase(String.format("%.2f", amount), dynamicFont)
            );
            valueCell.setBorder(Rectangle.NO_BORDER);
            valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            valueCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            summaryTable.addCell(valueCell);

            // Row 2: Add CGST
            if (state.equalsIgnoreCase("karnataka")) {
                labelCell = new PdfPCell(new Phrase("Add CGST :", regularFont));
                labelCell.setBorder(Rectangle.NO_BORDER);
                labelCell.setHorizontalAlignment(Element.ALIGN_LEFT);
                summaryTable.addCell(labelCell);

                valueCell = new PdfPCell(
                    new Phrase(String.format("%.2f", cgstAmount), dynamicFont)
                );
                valueCell.setBorder(Rectangle.NO_BORDER);
                valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                valueCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                summaryTable.addCell(valueCell);

                // Row 3: Add SGST
                labelCell = new PdfPCell(new Phrase("Add SGST :", regularFont));
                labelCell.setBorder(Rectangle.NO_BORDER);
                labelCell.setBorderWidthBottom(0.5f);
                labelCell.setBorderColorBottom(textColor);
                labelCell.setPaddingBottom(5);
                labelCell.setHorizontalAlignment(Element.ALIGN_LEFT);
                labelCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                summaryTable.addCell(labelCell);

                valueCell = new PdfPCell(
                    new Phrase(String.format("%.2f", sgstAmount), dynamicFont)
                );
                valueCell.setBorder(Rectangle.NO_BORDER);
                valueCell.setBorderWidthBottom(0.5f);
                valueCell.setBorderColorBottom(textColor);
                valueCell.setPaddingBottom(5);
                valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                valueCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                summaryTable.addCell(valueCell);
            } else {
                // Row 2: Add IGST
                labelCell = new PdfPCell(new Phrase("Add IGST :", regularFont));
                labelCell.setBorder(Rectangle.NO_BORDER);
                labelCell.setBorderWidthBottom(0.5f);
                labelCell.setBorderColorBottom(textColor);
                labelCell.setPaddingBottom(5);
                labelCell.setHorizontalAlignment(Element.ALIGN_LEFT);
                labelCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                summaryTable.addCell(labelCell);

                valueCell = new PdfPCell(
                    new Phrase(String.format("%.2f", igstAmount), dynamicFont)
                );
                valueCell.setBorder(Rectangle.NO_BORDER);
                valueCell.setBorderWidthBottom(0.5f);
                valueCell.setBorderColorBottom(textColor);
                valueCell.setPaddingBottom(5);
                valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                valueCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                summaryTable.addCell(valueCell);
            }

            // Row 4: Total Amount after Tax
            labelCell = new PdfPCell(new Phrase("Total Amount after Tax :", regularFont));
            labelCell.setBorder(Rectangle.NO_BORDER);
            labelCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            summaryTable.addCell(labelCell);

            valueCell = new PdfPCell(
                new Phrase(String.format("%.2f", totalAmountWithTax), dynamicFont)
            );
            valueCell.setBorder(Rectangle.NO_BORDER);
            valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            valueCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            summaryTable.addCell(valueCell);

            // Add the summary table to the document
            document.add(summaryTable);

            // Convert amount to words
            String amountInWords = convertNumberToWords(totalAmountWithTax) + " Rupees only";

            // Add the amount in words - right aligned
            PdfPTable amountInWordsTable = new PdfPTable(1);
            amountInWordsTable.setWidthPercentage(40);
            amountInWordsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

            PdfPCell amountInWordsCell = new PdfPCell(new Phrase(amountInWords, dynamicFont));
            amountInWordsCell.setBorder(Rectangle.NO_BORDER);
            amountInWordsCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            amountInWordsCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            amountInWordsCell.setPaddingTop(5);
            amountInWordsCell.setPaddingBottom(5);
            amountInWordsTable.addCell(amountInWordsCell);

            // Add the amount in words table to the document
            document.add(amountInWordsTable);

            // Add spacing after amount in words
            document.add(new Paragraph(" ", spacingFont));
            document.add(new Paragraph(" ", spacingFont));
            document.add(new Paragraph(" ", spacingFont));

            // Add some spacing before the horizontal line
            document.add(new Paragraph(" ", regularFont));

            // Create a horizontal line across the entire PDF
            PdfPTable lineTable = new PdfPTable(1);
            lineTable.setWidthPercentage(100); // Full width of the page

            // Create a cell for the line
            PdfPCell lineCell = new PdfPCell();
            lineCell.setBorder(Rectangle.TOP); // Only top border
            lineCell.setBorderWidth(1f); // 1 point width
            lineCell.setBorderColor(textColor); // #696969 color
            lineCell.setFixedHeight(0f); // Minimal height
            lineCell.setPaddingTop(0);
            lineCell.setPaddingBottom(0);

            // Add the cell to the table
            lineTable.addCell(lineCell);

            // Add the line table to the document
            document.add(lineTable);

            // Add some spacing after the horizontal line
            document.add(new Paragraph(" ", regularFont));

            // Create a table for the signature section
            PdfPTable signatureTable = new PdfPTable(1);
            signatureTable.setWidthPercentage(100);

            // Create font for the name (12px)
            Font nameFont = FontFactory.getFont("Arial", 10);
            nameFont.setColor(Color.BLACK); // Black color specifically for the name

            // Add the name in 12px black text
            PdfPCell nameCell = new PdfPCell(new Phrase("PRAVEEN KUMAR", nameFont));
            nameCell.setBorder(Rectangle.NO_BORDER);
            nameCell.setPadding(0);
            nameCell.setPaddingBottom(3);
            signatureTable.addCell(nameCell);

            // Add the title (CEO) in regular font
            PdfPCell titleCell = new PdfPCell(new Phrase("CEO", regularFont));
            titleCell.setBorder(Rectangle.NO_BORDER);
            titleCell.setPadding(0);
            titleCell.setPaddingBottom(3);
            signatureTable.addCell(titleCell);

            // Add the company name in regular font
            PdfPCell companyCell = new PdfPCell(new Phrase("Qbic Catalyst Partner Pvt. Ltd", regularFont));
            companyCell.setBorder(Rectangle.NO_BORDER);
            companyCell.setPadding(0);
            companyCell.setPaddingBottom(42);
            signatureTable.addCell(companyCell);

            // Add the QCP logo after the company name
            try {
                // Create the image instance using ClassPathResource
                ClassPathResource resource = new ClassPathResource("images/qcp-logo.png");
                byte[] imageData = null;
                try {
                    imageData = new byte[resource.getInputStream().available()];
                    resource.getInputStream().read(imageData);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                
                if (imageData != null) {
                    Image qcpLogo = Image.getInstance(imageData);
                    
                    // Set height to 35 and calculate width to preserve aspect ratio
                    float originalWidth = qcpLogo.getWidth();
                    float originalHeight = qcpLogo.getHeight();
                    float aspectRatio = originalWidth / originalHeight;
                    float newHeight = 35; // 35px height as requested
                    float newWidth = newHeight * aspectRatio;
                    
                    qcpLogo.scaleToFit(newWidth, newHeight);
                    
                    // Define different y-positions for Karnataka and non-Karnataka states
                    float qcpPositionForKarnataka = 120;    // Adjust this value for Karnataka state
                    float qcpPositionForNonKarnataka = 133;  // Adjust this value for non-Karnataka states
                    
                    // Position the logo based on state
                    float xPosition = 18; // Same x position
                    float yPosition = state.equalsIgnoreCase("karnataka") ? qcpPositionForKarnataka : qcpPositionForNonKarnataka;
                    
                    qcpLogo.setAbsolutePosition(xPosition, yPosition);
                    
                    // Add the image to direct content
                    PdfContentByte contentByte = writer.getDirectContent();
                    contentByte.addImage(qcpLogo);
                }
            } catch (Exception e) {
                e.printStackTrace();
                // Handle the error appropriately
            }

            // Add the signature table to the document
            document.add(signatureTable);

             // Create a second horizontal line across the entire PDF (use different variable names)
             document.add(new Paragraph(" ", regularFont));
             PdfPTable lineTable2 = new PdfPTable(1);
             lineTable2.setWidthPercentage(100); // Full width of the page
 
             // Create a cell for the line
             PdfPCell lineCell2 = new PdfPCell();
             lineCell2.setBorder(Rectangle.TOP); // Only top border
             lineCell2.setBorderWidth(1f); // 1 point width
             lineCell2.setBorderColor(textColor); // #696969 color
             lineCell2.setFixedHeight(0f); // Minimal height
             lineCell2.setPaddingTop(0);
             lineCell2.setPaddingBottom(0);
 
             // Add the cell to the table
             lineTable2.addCell(lineCell2);
 
             // Add the second line table to the document
             document.add(lineTable2);

            // Create font for disclaimer heading (12px, black, underlined)
            Font disclaimerHeadingFont = FontFactory.getFont("Arial", 10);
            disclaimerHeadingFont.setColor(Color.BLACK);
            disclaimerHeadingFont.setStyle(Font.UNDERLINE);

            // Create font for disclaimer text
            Font disclaimerTextFont = FontFactory.getFont("Arial", 9);
            disclaimerTextFont.setColor(textColor);

            // Create table for disclaimer
            PdfPTable disclaimerTable = new PdfPTable(1);
            disclaimerTable.setWidthPercentage(100);

            // Add some spacing before disclaimer
            document.add(new Paragraph(" ", regularFont));

            // Add disclaimer heading
            PdfPCell disclaimerHeadingCell = new PdfPCell(new Phrase("Disclaimer", disclaimerHeadingFont));
            disclaimerHeadingCell.setBorder(Rectangle.NO_BORDER);
            disclaimerHeadingCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            disclaimerHeadingCell.setPadding(0);
            disclaimerHeadingCell.setPaddingBottom(10);
            disclaimerTable.addCell(disclaimerHeadingCell);

            // Add disclaimer text
            PdfPCell disclaimerTextCell = new PdfPCell(new Phrase(
                "\"All information will be maintained as per the privacy policy available on ___ (insert the web link). " +
                "This is a computer generated invoice. All services will be provided subject to the terms and conditions " +
                "available on ___(insert the web link). For any queries related to the invoice particulars, please reach " +
                "out to contact@techcell.org.\"", disclaimerTextFont));
            disclaimerTextCell.setBorder(Rectangle.NO_BORDER);
            disclaimerTextCell.setHorizontalAlignment(Element.ALIGN_CENTER);  // Center align the text
            disclaimerTextCell.setPadding(0);
            disclaimerTable.addCell(disclaimerTextCell);

            // Add the disclaimer table to the document
            document.add(disclaimerTable);
            
        } catch (DocumentException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate PDF", e);
        } finally {
            document.close();
        }

        return outputStream.toByteArray();
    }
    
    /**
     * Converts a number to words
     * @param number The number to convert
     * @return The number in words
     */
    private String convertNumberToWords(double number) {
        String[] units = {"", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
                          "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"};
        String[] tens = {"", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"};
        
        if (number == 0) return "Zero";
        
        // Separate the whole and decimal parts
        int wholePart = (int) number;
        int decimalPart = (int) Math.round((number - wholePart) * 100);
        
        // Handle the whole part
        String result = "";
        
        if (wholePart >= 1000) {
            result += units[wholePart / 1000] + " Thousand ";
            wholePart %= 1000;
        }
        
        if (wholePart >= 100) {
            result += units[wholePart / 100] + " Hundred ";
            wholePart %= 100;
        }
        
        if (wholePart > 0) {
            if (!result.isEmpty()) {
                result += "and ";
            }
            
            if (wholePart < 20) {
                result += units[wholePart];
            } else {
                result += tens[wholePart / 10];
                if (wholePart % 10 > 0) {
                    result += " " + units[wholePart % 10];
                }
            }
        }
        
        return result.trim();
    }
}