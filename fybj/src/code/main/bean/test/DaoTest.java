package code.main.bean.test;

import code.main.bean.entity.CommArchive;
import code.main.bean.service.ArchiveService;
import code.main.bean.util.ExportUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileOutputStream;
import java.util.List;

@ContextConfiguration("classpath:config-spring.xml")
@RunWith(value=SpringJUnit4ClassRunner.class) 
public class DaoTest {
	
	@Resource(name = "archiveService")
	private ArchiveService archiveService;
	
	@Test
	public void test01() {
		CommArchive archive = new CommArchive();
		archive.setAddress("fsd");
		archiveService.add(archive);
	}
	
	@Test
	public void test02() {
		CommArchive archive = new CommArchive();
		archive.setAddress("fsd");
		archive.setId(3);
		archiveService.update(archive);
	}

    @Test
    public void test03() {
        List<CommArchive> list =
        archiveService.findList("12,13");
        for(CommArchive ca : list) {
            System.out.println(ca);
        }
    }

    @Test
    public void test04() throws Exception {
        List<CommArchive> archives = archiveService.findList("12,13");
        ExportUtils<CommArchive> exportUtils = new ExportUtils<CommArchive>();
        FileOutputStream fos = new FileOutputStream(new File("D:/result.xls"));
        HSSFWorkbook wb = exportUtils.createWorkbookByBeanList(archives, new String[]{"id", "name", "certNo"});
        wb.write(fos);
    }
}