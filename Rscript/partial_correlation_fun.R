.libPaths("/usr/lib/opencpu/library/")

# stop(paste0(strsplit(find.package("data.table"),"/")[[1]][1:(length(strsplit(find.package("data.table"),"/")[[1]])-1)],collapse = "/"))

install.packages("ppcor");

  pacman::p_load(data.table, Hmisc,ppcor, MASS, parallel)

  save(e,f,p,e2,f2,p2,project_id,confounder_column,file="local.RData")
  # load("local.RData")
  # result = TRUE
  
  e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  e = t(apply(e,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))
  if(is.null(dim(e))){# this means that the data has only one variable
    e = t(e)
  }
  e2 = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e2.csv"))))
  e2 = t(apply(e2,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))
  if(is.null(dim(e2))){# this means that the data has only one variable
    e2 = t(e2)
  }
  colnames(e) = p$label
  colnames(e2) = p2$label



  if(is.null(dim(f2))){
    f2 = data.table(label = f2)
  }

  # make sure sample to match the first dataset.
  
  p_all = merge(p, p2, by = "label", all.x = F, all.y = F, sort = FALSE)

  e = e[,p_all$label]
  e2 = e2[,p_all$label]

  confounder_index = f2$label%in%confounder_column
  confounders = t(e2[confounder_index,])

  e2 = e2[!confounder_index,]
  f2 = f2[!confounder_index,]
  if(is.null(dim(f2))){
    f2 = data.table(label = f2)
  }


  num_NA_confounder = apply(confounders,1,function(x){sum(is.na(x))})
  
  if(!length(num_NA_confounder)==0){
    e. = e[,num_NA_confounder<1]
    e2. = e2[,num_NA_confounder<1]
    confounders. = confounders[num_NA_confounder<1,]
  }


  r = matrix(NA, nrow = nrow(e.), ncol = nrow(e2.))
  p_vals = matrix(NA, nrow = nrow(e.), ncol = nrow(e2.))

  cl=makeCluster(2)
  tests = list()
    for(j in 1:nrow(e2.)){
      tests[[j]] = parSapply(cl,1:nrow(e.),function(i,e.,e2.,pcor.test,confounders.,j,method){
        tryCatch({
          NAs = is.na(e.[i,]) | is.na(e2.[j,])
          return(pcor.test(x=e.[i,!NAs],y=e2.[j,!NAs],z=confounders.[!NAs,],method=method))
        },error=function(er){return(matrix(rep(NA,6),nrow = 1));})
      },e.,e2.,pcor.test,confounders.,j,method)
    }
  stopCluster(cl)



  r = sapply(tests,function(x){x[1,]})
  pval = sapply(tests,function(x){x[2,]})


  partial_correlation = data.table(index = 1:nrow(f), label = f$label, r)
  colnames(partial_correlation) = c("index","label",f2$label)

  partial_correlation_sig = data.table(index = 1:nrow(f), label = f$label, pval)
  colnames(partial_correlation_sig) = c("index","label",f2$label)




  #data_matrix = as.matrix(averages)
  report_html = paste0("<h4>The <code>",method,"</code> partial correlation was calculated. The partial correlation coefficient and corresponding p-values are provided.</h4>")

  result =list(
    data_matrix = partial_correlation,
    data_matrix2 = partial_correlation_sig,
    report_html =report_html
  )

















