{
    Brand: documentType?.Brand ?? empty,
    CompanyCode: documentType?.CompanyCode ?? empty,
    ContractNo: documentType?.ContractNumber ?? empty,
    ProjectCode: documentType?.ProjectCode ?? empty,
    Tower_Phase: documentType?.Tower_Phase ?? empty,
    CustomerCode: documentType?.CustomerCode ?? empty,
    ProjectName: documentType?.ProjectName ?? empty,
    DocumentGroupDescription: documentType?.DocumentGroup ?? empty,
    DocumentGroupShortDescription: empty,
    DocumentTypeID: empty,
    DocumentTypeDescription: documentType?.Nomenclature ?? empty,
    DocumentTypeShortDescription: empty,
    DocumentName: documentType?.Nomenclature ?? empty,
    MIMEType: document.mimeType,
    DocumentDate: empty,// or manual input in QA. Format: MMDDYYYY
    FileSize: document.documentSize.toString(),
    B64Attachment: buffer.toString('base64'),
    
    
    
    
    // get doc type (barcode only)
    CustomerName: contractDetail?.CustomerName ?? documentType?.AccountName, 
    
    // get contract
    UnitDescription: documentType?.UnitDetails ?? empty,

    // both
    DocumentGroupID: empty,
    ExternalSourceCaptureDate: // the date when upload to springcm. Format: M/D/YYYY h:mm:ss A
    FileName: documentType?.Nomenclature, // concat the extension. Ex. Contract to Sell (CTS) -Signed by Buyer.pdf
    ExternalSourceUserID: // email address w/o domain. Ex. mbisla
    SourceSystem: 'RIS',
    DataCapDocSource: 'RIS',
    DataCapRemarks: // system remarks
    Remarks: empty, // system remarks

    
}