package com.hengtiansoft.bluemorpho.workbench.dto;

import java.io.OutputStream;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.web.servlet.view.document.AbstractExcelView;

/**
 * @author <a href="mailto:chendonghuang@hengtiansoft.com"> chendonghuang</a>
 * @version 创建时间：Jun 22, 2018 2:01:21 PM
 */
@SuppressWarnings("deprecation")
public class WordAndPhraseTagCorpusExcelView extends AbstractExcelView {

	private String fileSuffix;

	public WordAndPhraseTagCorpusExcelView() {
		super();
	}

	public WordAndPhraseTagCorpusExcelView(String fileSuffix) {
		super();
		this.fileSuffix = fileSuffix;
	}

	@SuppressWarnings("unchecked")
	@Override
	protected void buildExcelDocument(Map<String, Object> model,
			HSSFWorkbook book, HttpServletRequest request,
			HttpServletResponse resp) throws Exception {
		List<WordAndPhraseTagCorpusResponse> dataList = (List<WordAndPhraseTagCorpusResponse>) model.get("data");

		resp.setContentType("application/vnd.ms-excel");
		resp.setHeader("Content-Disposition", "attachment;filename="
				+ new String(("WordCorpus_" + this.fileSuffix + ".xls").getBytes(), "ISO8859-1"));

		HSSFSheet sheet = book.createSheet("word_and_phrase_tag_corpus");

		HSSFRow row1 = sheet.createRow(0);
		row1.createCell(0).setCellValue("phrase");
		row1.createCell(1).setCellValue("tag");
		row1.createCell(2).setCellValue("business_domain");
		row1.createCell(3).setCellValue("organization");
		row1.createCell(4).setCellValue("system");
		row1.createCell(5).setCellValue("code_type");
		row1.createCell(6).setCellValue("frequency");
		row1.createCell(7).setCellValue("system_rank");
		row1.createCell(8).setCellValue("organization_rank");
		row1.createCell(9).setCellValue("business_domain_rank");
		row1.createCell(10).setCellValue("general_rank");

		int contentRow = 1;
		for (WordAndPhraseTagCorpusResponse data : dataList) {
			HSSFRow row = sheet.createRow(contentRow);
			row.createCell(0).setCellValue(data.getPhrase());
			row.createCell(1).setCellValue(data.getTag());
			row.createCell(2).setCellValue(data.getBusinessDomain());
			row.createCell(3).setCellValue(data.getOrganization());
			row.createCell(4).setCellValue(data.getSystem());
			row.createCell(5).setCellValue(data.getCodeType());
			row.createCell(6).setCellValue(data.getFrequency());
			row.createCell(7).setCellValue(data.getSystemRank());
			row.createCell(8).setCellValue(data.getOrganizationRank());
			row.createCell(9).setCellValue(data.getBusinessDomainRank());
			row.createCell(10).setCellValue(data.getGeneralRank());
			contentRow++;
		}

		OutputStream ouputStream = resp.getOutputStream();
		book.write(ouputStream);
		ouputStream.flush();
		ouputStream.close();
	}

	public String getFileSuffix() {
		return fileSuffix;
	}

	public void setFileSuffix(String fileSuffix) {
		this.fileSuffix = fileSuffix;
	}

}
