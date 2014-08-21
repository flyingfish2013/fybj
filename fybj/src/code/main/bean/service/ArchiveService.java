package code.main.bean.service;

import code.main.bean.domain.Page;
import code.main.bean.entity.CommArchive;

import java.util.List;
import java.util.Map;

public interface ArchiveService {

	@SuppressWarnings("unchecked")
	Map add(CommArchive archive);
	
	@SuppressWarnings("unchecked")
	Map update(CommArchive archive);

	Page findPage(String field,String keyword);
	
	@SuppressWarnings("unchecked")
	Map delete(String id);

    List<CommArchive> findList(String ids);
}