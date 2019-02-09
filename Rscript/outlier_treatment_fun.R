

  # pacman::p_load(data.table)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  result = e
  if(auto){
    e_out = matrix(NA,nrow = nrow(e), ncol = ncol(e))
    for(i in 1:nrow(e)){
      out_val = boxplot.stats(result[i,], coef = criterion)$out
      if(length(out_val)>0){
        suspect_val = out_val
        e_out[i,result[i,]%in%(suspect_val[suspect_val%in%out_val])] = "out"

        if(method=='median'){
          result[i,result[i,]%in%(suspect_val[suspect_val%in%out_val])] = median(result[i,!result[i,]%in%(suspect_val[suspect_val%in%out_val])], na.rm = TRUE)
        }else if(method=='mean'){
          result[i,result[i,]%in%(suspect_val[suspect_val%in%out_val])] = mean(result[i,!result[i,]%in%(suspect_val[suspect_val%in%out_val])], na.rm = TRUE)
        }else if(method == "max/min"){

          out_val_large = out_val[out_val>median(result[i,])]
          out_val_small = out_val[out_val<median(result[i,])]

          result[i,result[i,]%in%(suspect_val[suspect_val%in%out_val_large])] = max(result[i,!result[i,]%in%(suspect_val[suspect_val%in%out_val])], na.rm = TRUE)

          result[i,result[i,]%in%(suspect_val[suspect_val%in%out_val_small])] = min(result[i,!result[i,]%in%(suspect_val[suspect_val%in%out_val])], na.rm = TRUE)
        }
      }
    }
  }else{
    for(i in 1:nrow(e)){
      out_val = boxplot.stats(result[i,])$out
      if(length(out_val)>0){
        suspect_val = result[i,p[[column]]%in%level]
        e_out[i,result[i,]%in%(suspect_val[suspect_val%in%out_val])] = "out"
        if(method=='median'){
          result[i,result[i,]%in%(suspect_val[suspect_val%in%out_val])] = median(result[i,!result[i,]%in%(suspect_val[suspect_val%in%out_val])], na.rm = TRUE)
        }else if(method=='mean'){
          result[i,result[i,]%in%(suspect_val[suspect_val%in%out_val])] = mean(result[i,!result[i,]%in%(suspect_val[suspect_val%in%out_val])], na.rm = TRUE)
        }else if(method == "max/min"){

          out_val_large = out_val[out_val>median(result[i,])]
          out_val_small = out_val[out_val<median(result[i,])]

          result[i,result[i,]%in%(suspect_val[suspect_val%in%out_val_large])] = max(result[i,!result[i,]%in%(suspect_val[suspect_val%in%out_val])], na.rm = TRUE)

          result[i,result[i,]%in%(suspect_val[suspect_val%in%out_val_small])] = min(result[i,!result[i,]%in%(suspect_val[suspect_val%in%out_val])], na.rm = TRUE)

        }
      }
    }
  }




  p_plus_e = rbind(cbind(colnames(p),t(p)), cbind(f$label,result))

  # add some NA to the top of the f.
  f_label_index = which(p_plus_e[,1]=='label')
  NA_plus_f = rbind(matrix(NA, nrow = f_label_index-1, ncol = ncol(f)),rbind(matrix(colnames(f), nrow = 1),sapply(f, as.character)))
  NA_plus_f = NA_plus_f[,-which(colnames(NA_plus_f) %in% 'label')]

  data = cbind(NA_plus_f, p_plus_e)



  data_out = aggregate_p_f_e(p,f,e_out)


  #   pacman::p_load(reshape2, ggplot2, plotly)
  #
  #   ggplot(data = melt(result[,-1]), aes(x=variable, y=log(value))) + geom_boxplot(aes(fill=variable))+theme_bw()
  #
  #
  #
  #   o = ggplotly()

  data_matrix = as.matrix(data)
  if(auto){
    report_html = paste0("<b>Outliers were detected automatically by boxplot <code>(criterion: ",criterion,")</code> for each compound. The outliers were imputed by the <code>",method,"</code> for each compound. <em>The outliers are flagged as 'out' in the 'Outlier flag.csv' (shown when saved).</em></b>")
  }else{
    report_html = paste0("<b>Outliers were defined as <code>",column ," (",paste0(level, ', '),")</code>. The outliers were imputed by the <code>",method,"</code> for each compound ONLY IF the defined outliers are determined to be an outlier by boxplot <code>(criterion: 1.5)</code>. <em>The outliers are flagged as 'out' in the 'Outlier flag.csv' (shown when saved).</em></b>")
  }


result = list(
    data_matrix = data_matrix,
    report_html =report_html,
    data_out = data_out
  )




















