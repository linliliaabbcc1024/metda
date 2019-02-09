

  pacman::p_load(data.table)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))

e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  e = t(apply(e,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))


  level = unique(p[[column]])
  groups = factor(p[[column]], levels = level)


  if(method == "median"){
    m1 = apply(e[,groups == level[1]],1,median, na.rm=TRUE)
    m2 = apply(e[,groups == level[2]],1,median, na.rm=TRUE)
    if(direction=='a_over_b'){
        fc = m1/m2
    }else{
        fc = m2/m1
    }
  }else if(method == "mean"){
    m1 = apply(e[,groups == level[1]],1,mean, na.rm=TRUE)
    m2 = apply(e[,groups == level[2]],1,mean, na.rm=TRUE)
    if(direction=='a_over_b'){
        fc = m1/m2
    }else{
        fc = m2/m1
    }
  }
  fc[is.nan(fc)] = 1

  result = data.table(index = 1:nrow(f),label = f$label,fold_change = fc)

  colnames(result) = c("index","label", paste0(method," fold change"))


  report_html = paste0("<b>Fold Change, defined as the <code>",method,"</code> average ratio of <code>",ifelse(direction=='a_over_b',level[1],level[2])," over ",ifelse(direction=='a_over_b',level[2],level[1]),"</code>, is calculated for each compound.</b>")

  result = list(
    result = result,
    report_html =report_html
  )























