


pacman::p_load(data.table)
# load("local.RData")
# parameter_names = names(parameters)
# for(i in 1:length(parameters)){
#   assign(parameter_names[i], parameters[[parameter_names[i]]])
# }

if(from_type == 'PubChem CID'){
  if("smiles" %in% to_type){
    d = fread(paste0("https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/",paste0(f[[from_column]],collapse=","),"/property/CanonicalSMILES/CSV"))
    d_merge = merge(f,d,by.x = from_column, by.y = "CID", sort = FALSE, all.x = TRUE)
    f[['smiles']] = d_merge$CanonicalSMILES
  }
}

new_f = data.table(f[,!colnames(f)%in%"label"],label = f[['label']])

data = aggregate_p_f_e(p,new_f,e)

data_matrix = data.matrix(data)

report_html = "The ID Exchanger is finished."
result = list(
  data_matrix = data_matrix,
  report_html =report_html
)
