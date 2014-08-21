package code.main.bean.util;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.List;

/**
 * Created by pangbo on 2014/8/20. good day commander!
 */

public class ExportUtils<T> {

    public HSSFWorkbook createWorkbookByBeanList(List<T> collection, String[] fieldNames) throws Exception {
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        HSSFRow row = null;
        HSSFCell cell = null;

            /**
             * 写字段信息
             */
            row = sheet.createRow(0);
            for (short x = 0; x < fieldNames.length; x++) {
                cell = row.createCell(x);
                String fieldNameEn = fieldNames[x];
                cell = row.createCell(x);
                cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                cell.setCellValue(fieldNameEn);
            }

            for (int i = 1; i <= collection.size(); i++) {
                T t = collection.get(i - 1);
                row = sheet.createRow(i);
                for (short j = 0; j < fieldNames.length; j++) {
                    String fieldName = fieldNames[j];
                    cell = row.createCell(j);
                    PropertyDescriptor pd = new PropertyDescriptor(fieldName,t.getClass());
                    Method method = pd.getReadMethod();
                    Object value = method.invoke(t, new Object[] {});
                    converCellType(cell, method.getReturnType(), value);
                }
        }
        return wb;
    }
    private void converCellType(HSSFCell cell, Class<?> clazz, Object value) {
        if (value != null) {
            if (clazz.isAssignableFrom(Integer.class)) {
                cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
                int intVal = Integer.parseInt(value.toString());
                cell.setCellValue(intVal);
            } else if (clazz.isAssignableFrom(Double.class)) {
                cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
                double doubleVal = Double.parseDouble(value.toString());
                cell.setCellValue(doubleVal);
            } else {
                try {
                    Double result = Double.parseDouble(value.toString());
                    cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
                    cell.setCellValue(result);
                } catch (NumberFormatException e) {
                    cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                    cell.setCellValue(value.toString());
                }
            }
        } else {
            cell.setCellType(HSSFCell.CELL_TYPE_STRING);
            String stringVal = "";
            cell.setCellValue(stringVal);
        }
    }
}