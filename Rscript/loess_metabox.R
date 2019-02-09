

pacman::p_load(data.table)
e = data.matrix(fread(URLencode(paste0("http://metda.fiehnlab.ucdavis.edu/db/project/",project_id,"/temp_e.csv"))))
  library(ggplot2)
  sp <- ggplot(tips, aes(x=total_bill, y=tip/total_bill, color = smoker )) + geom_point(shape=1)
  sp <- sp + facet_wrap( ~ day, ncol=2)


  library(plotly)

  o = ggplotly()









  library(bootstrap)
  loess_wrapper_extrapolate <- function (x, y, span.vals = seq(0.01, 0.2,by = 0.01), folds = 5){
    # Do model selection using mean absolute error, which is more robust than squared error.
    mean.abs.error <- numeric(length(span.vals))

    # Quantify error for each span, using CV
    loess.model <- function(x, y, span){
      loess(y ~ x, span = span, control=loess.control(surface="direct"))
    }

    loess.predict <- function(fit, newdata) {
      predict(fit, newdata = newdata)
    }

    span.index <- 0
    for (each.span in span.vals) {
      span.index <- span.index + 1
      y.hat.cv <- crossval(x, y, theta.fit = loess.model, theta.predict = loess.predict, span = each.span, ngroup = folds)$cv.fit
      non.empty.indices <- !is.na(y.hat.cv)
      mean.abs.error[span.index] <- mean(abs(y[non.empty.indices] - y.hat.cv[non.empty.indices]))
    }

    # find the span which minimizes error
    best.span <- span.vals[which.min(mean.abs.error)]

    # fit and return the best model
    best.model <- loess(y ~ x, span = best.span, control=loess.control(surface="direct"))
    return(best.model)
  }


  x = 1:length(y)
  loess_wrapper_extrapolate = function(x,y, span.vals = seq(0.01, 0.2,by = 0.01), folds = 5){

mean_abs_error = c()
    for(i in 1:length(span.vals)){
      error = c()
      for(k in 1:folds){

        train_index = sample(x,0.8*length(x))
        test_index = x[!x%in%train_index]

        predicted = predict(loess(y[train_index] ~ x[train_index], span = span.vals[i], control=loess.control(surface="direct")),x[test_index])

        error[k] = mean(abs(predicted - y[test_index]))


      }
      mean_abs_error[i] = mean(error)

    }


best_span = span.vals[which.min(mean_abs_error)]

return(best_span)



  }


  o = wcmc::read_data("upload_loess_normalization_dataset_example.xlsx")
  p = o$p
  f = o$f
  e = o$e_matrix


  plot_data = data.table(value = e[1,], batch = p$batch, sampleType = ifelse(p$sampleType=='qc',"qc","sample"))





  y = o$e_matrix[1,]
  x = 1:length(y)
  l = loess_wrapper_extrapolate(x,y)
  l$pars$span




  pacman::p_load(data.table)
  # dataset_input = fread("dataset_input.csv")
  # dataset_input = as.list(dataset_input)
  # p = fread("p.csv")
  # f = fread("f.csv")
  # e = do.call("cbind",dataset_input[c(-1, -length(dataset_input))])
  # e = t(apply(e,1,as.numeric))

  e = t(apply(e,1,function(x){
    x[is.na(x)] = 0.5 * mean(x[!is.na(x)])
    return(x)
  }))


  groups = factor(p[[groups]], levels = levels)


  if(length(confounders)>0){

    for(i in 1:length(confounders)){
      assign(confounders[i], p[[confounders[i]]])
    }

    formular_text = paste0("x~groups+",paste0(confounders,collapse = "+"))
    e_adjusted = t(apply(e,1,function(x){
      lm = lm(as.formula(formular_text))
      x[groups%in%levels[2]] = lm$residuals[groups%in%levels[2]]  + lm$coefficients[1] + lm$coefficients[2]
      x[!groups%in%levels[2]] = lm$residuals[!groups%in%levels[2]]  + lm$coefficients[1]
      return(x)
    }))
  }else{
    e_adjusted = e
  }

  t_tests = apply(e_adjusted,1,function(x){
    t.test(x~groups, var.equal = TRUE, alternative = alternative)
  })
  p_values = sapply(t_tests,function(x){
    x$p.value
  })

  result = data.table(index = 1:nrow(f), label = f$label, p_values = p_values, p_values_adjusted = p.adjust(p_values, method = FDR))


  report_html = paste0("<h4>Student's t-test was used on each compound to test if the mean average of <code>",levels[1],"</code> ",ifelse(alternative=='two.sided',"different from", ifelse(alternative=='greater', "greater than", "less than")), " <code>", levels[2],"</code>. Out of <code>",nrow(f),"</code> compounds, <code>", sum(result$p_values<0.05,na.rm = TRUE),"</code> are significant with p_value < 0.05. To control the false disvoery rate (FDR), <code>",FDR,"</code> procedure was used and <code>",sum(result$p_values_adjusted<0.05,na.rm = TRUE),"</code> compounds are significant after FDR correction.</h4>")

  result =list(
    result = result,
    report_html =report_html
  )























