
pacman::p_load(data.table, ropls)
fwrite(data.table(p),"p.csv")
fwrite(data.table(f),"f.csv")
fwrite(data.table(e),"e.csv")
# return(p)

# dataset_input = fread("dataset_input.csv")
# dataset_input = as.list(dataset_input)
# p = fread("p.csv")
# f = fread("f.csv")
# e = fread("e.csv"); e = data.matrix(e)

# save(project_id,e,f,p,column,confounder,file='local.RData')
# result = TRUE

# load("local.RData")

# project_id = "test_1555960988902"



# data = wcmc::read_data("C:\\Users\\Sili\\Documents\\Github\\Bajaj_2_5_2019\\Bajaj Urine\\ID Exchanger\\Log Transformation\\Log Transformation.csv")
# 
# # e = data$e_matrix
# f = data$f
# p = data$p





e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
e = t(apply(e,1,function(x){
  x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
  return(x)
}))

if(scale=='none'){
  sds = rep(1,nrow(f))
}else if(scale=="standard"){
  sds = apply(e,1,sd,na.rm = TRUE)
}else if(scale=='pareto'){
  sds = sqrt(apply(e,1,sd,na.rm = TRUE))
}else if(scale == "center"){
  sds = rep(1,nrow(f))
}

e_t = t(e)
e_scale = scale(e_t, center = !scale=='none', scale = sds)



y = as.numeric(factor(p[[column]]))-1


# confounder[confounder %in% "Alcohol Etiology_covar.1"] = "Alcohol Etiology_covar_1"

if("NO_CONFOUNDER" %in% confounder){
  dta = data.table(y=y,x = 1:length(y))
}else{
  dta = data.table(y=y,x = 1:length(y))
  for(i in 1:length(confounder)){
    p[[confounder[i]]][p[[confounder[i]]]==''] = NA
    p[[confounder[i]]][is.na(p[[confounder[i]]])] = mean(as.numeric(p[[confounder[i]]]), na.rm=TRUE)

    if(sum(is.na(as.numeric(p[[confounder[i]]]))) > 0){ # this means that the confounder i is a character confounder.
      print(i)
      dta[[paste0("c",i)]] = factor(p[[confounder[i]]])
    }else{
      dta[[paste0("c",i)]] = scale(as.numeric(p[[confounder[i]]]))
    }
  }
}

result_matrix = t(apply(e_scale,2,function(x){
  dta$x=x
  lm = glm(y ~ .,data = dta[dta$y<=1 & dta$y>=0,], family = "binomial")
  smr = summary(lm)
  beta = smr$coefficients[2,1]
  pval = smr$coefficients[2,4]
  return(c(beta,pval))
}))

p_values_adjusted = p.adjust(result_matrix[,2], method = FDR)

result = data.table(index=1:nrow(f), label = f$label, result_matrix,p_values_adjusted)
colnames(result) = c("index",'label',"regression_coefficient", "p_value", "p_values_adjusted")






report_html = paste0("<h4>Logistic regressions between <code>",column,"</code> and each compound were applied. There are ",sum(result_matrix[,2]<0.05, na.rm = TRUE)," compounds significantly associated with the <code>",column,"</code> with p value < 0.05. To control the False Discovery Rate (FDR), <code>",FDR,"</code> was applied on the p_values. There are <code>",sum(p_values_adjusted<0.05, na.rm = TRUE),"</code> still significant after correct for the FDR. Regression coefficients were provided to indicate possitive/negative association. The R-square and adjusted R-square, which measures how close the data are to the fitted regression line, are also calculated.</h4>")



result = list(
  result = result,
  report_html =report_html
)
















