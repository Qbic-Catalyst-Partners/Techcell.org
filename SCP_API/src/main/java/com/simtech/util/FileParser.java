package com.simtech.util;

import java.util.Date;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.DateUtil;

public class FileParser {

	public String getCellValue(Cell cell) {
		if (cell == null) {
			return null;
		}

		switch (cell.getCellType()) {
		case STRING:
			return cell.getStringCellValue();
		case NUMERIC:
			return formatNumericCell(cell);
		case BOOLEAN:
			return String.valueOf(cell.getBooleanCellValue());
		case BLANK:
		default:
			return null;
		}
	}

	public static String formatNumericCell(Cell cell) {
		DataFormatter dataFormatter = new DataFormatter();
		if (cell.getCellType() == CellType.NUMERIC) {
			double numericValue = cell.getNumericCellValue();
			if (numericValue == Math.floor(numericValue)) {
				// If the decimal part is zero, format as integer
				return dataFormatter.formatRawCellContents(numericValue, cell.getCellStyle().getDataFormat(),
						cell.getCellStyle().getDataFormatString());
			} else {
				// If there is a non-zero decimal part, format as a decimal
				return dataFormatter.formatCellValue(cell);
			}
		} else {
			// For non-numeric cells, use the default formatting
			return dataFormatter.formatCellValue(cell);
		}
	}

	public Date getDateCellValue(Cell cell) {
		double numericValue = cell.getNumericCellValue();
		return DateUtil.getJavaDate(numericValue);
	}

}
