testing_missing_imputation = function(){
  pacman::p_load(magrittr)
  # Missing at Random Function ----------------------------------------------
  # MCAR_generate <- function(data, var_mis = 0.2, mis_prop = 0.2) {
  #   mis_var_idx <- sample(1:ncol(data), round(ncol(data)*var_mis))
  #   mis_idx_mat <- data.frame(row_idx = NULL, col_idx = NULL)
  #   for (idx_temp in mis_var_idx) {
  #     idx_df <- data.frame(row_idx = sample(1:nrow(data), round(ncol(data)*var_mis)), col_idx = idx_temp)
  #     mis_idx_mat <- rbind(mis_idx_mat, idx_df)
  #   }
  #   mis_idx_mat <- as.matrix(mis_idx_mat)
  #   data_mis <- data
  #   data_mis[mis_idx_mat] <- NA
  #   return (list(data_mis = data_mis, mis_idx = mis_idx_mat))
  # }

  MCAR_generate <- function(data, mis_prop = 0.5) {
    all_idx <- which(data != Inf, arr.ind = T)
    rdm_idx <- sample(1:nrow(all_idx), round(nrow(all_idx)*mis_prop))
    slc_idx <- all_idx[rdm_idx, ]
    data_res <- data
    data_res[slc_idx] <- NA
    return(list(data_res = data_res, mis_idx = slc_idx))
  }

  # RSR calculation ---------------------------------------------------------
  # RSR_calculate <- function(data_c, data_i) {
  #   RSR <- sqrt(sum((data_c - data_i)^2)/sum((data_c - mean(unlist(data_c)))^2))
  #   return(RSR)
  # }



  # MNAR imputation compare -------------------------------------------------
  MNAR_generate <- function (data_c, mis_var = 0.5, var_prop = seq(.3, .6, .1)) {
    data_mis <- data_c
    if (is.numeric(mis_var)) var_mis_list <- sample(1:ncol(data_c), round(ncol(data_c)*mis_var))
    else if (is.character(mis_var)) var_mis_list <- which(colnames(data_c) %in% mis_var)
    for (i in 1:length(var_mis_list)) {
      var_idx <- var_mis_list[i]
      cur_var <- data_mis[, var_idx]
      cutoff <- quantile(cur_var, sample(var_prop, 1))
      cur_var[cur_var < cutoff] <- NA
      data_mis[, var_idx] <- cur_var
    }
    mis_idx_df <- which(is.na(data_mis), arr.ind = T)
    return (list(data_mis = data_mis, mis_idx_df = mis_idx_df))
  }

  # Scale and recover -------------------------------------------------------
  scale_recover <- function(data, method = 'scale', param_df = NULL) {
    results <- list()
    data_res <- data
    if (!is.null(param_df)) {
      if (method=='scale') {
        data_res[] <- scale(data, center=param_df$mean, scale=param_df$std)
      } else if (method=='recover') {
        data_res[] <- t(t(data)*param_df$std+param_df$mean)
      }
    } else {
      if (method=='scale') {
        param_df <- data.frame(mean=sapply(data, function(x) mean(x, na.rm=T)),
                               std=sapply(data, function(x) sd(x, na.rm=T)))
        data_res[] <- scale(data, center=param_df$mean, scale=param_df$std)
      } else {stop('no param_df found for recover...')}
    }
    results[[1]] <- data_res
    results[[2]] <- param_df
    return(results)
  }



  # Multiplot 4 ggplot2 -----------------------------------------------------
  multiplot <- function(..., plotlist=NULL, file, cols=1, layout=NULL) {
    library(grid)

    # Make a list from the ... arguments and plotlist
    plots <- c(list(...), plotlist)

    numPlots = length(plots)

    # If layout is NULL, then use 'cols' to determine layout
    if (is.null(layout)) {
      # Make the panel
      # ncol: Number of columns of plots
      # nrow: Number of rows needed, calculated from # of cols
      layout <- matrix(seq(1, cols * ceiling(numPlots/cols)),
                       ncol = cols, nrow = ceiling(numPlots/cols))
    }

    if (numPlots==1) {
      print(plots[[1]])

    } else {
      # Set up the page
      grid.newpage()
      pushViewport(viewport(layout = grid.layout(nrow(layout), ncol(layout))))

      # Make each plot, in the correct location
      for (i in 1:numPlots) {
        # Get the i,j matrix positions of the regions that contain this subplot
        matchidx <- as.data.frame(which(layout == i, arr.ind = TRUE))

        print(plots[[i]], vp = viewport(layout.pos.row = matchidx$row,
                                        layout.pos.col = matchidx$col))
      }
    }
  }




  # Imputation Wrapper ------------------------------------------------------
  pacman::p_load(missForest, impute, magrittr, imputeLCMD)
  # data columns are variables. rows are samples.
  e = fread("e.csv")
  e = log((data.matrix(e) + sqrt(e^2 + 4)) * 0.5, base  = 2)

  e_t = data.table(t(e))


  RF_wrapper <- function(data, ...) {
    result <- missForest(data, ...)[[1]]
    return (result)
  }
  RF_miss = RF_wrapper(e_t)
  sum(is.na(RF_miss))

  kNN_wrapper <- function(data, ...) {
    result <- data %>% data.matrix %>% impute.knn(., ...) %>% extract2(1)
    return(result)
  }
  # 150 573
  KNN_miss = kNN_wrapper(e_t)
  sum(is.na(KNN_miss))


  SVD_wrapper <- function(data, K = 5) {
    data_sc_res <- scale_recover(data, method = 'scale')
    data_sc <- data_sc_res[[1]]
    data_sc_param <- data_sc_res[[2]]
    result <- data_sc %>% impute.wrapper.SVD(., K = K) %>%
      scale_recover(., method = 'recover', param_df = data_sc_param) %>% extract2(1)
    return(result)
  }
  SVD_miss = SVD_wrapper(e_t)
  sum(is.na(SVD_miss))


  Mean_wrapper <- function(data) {
    result <- data
    result[] <- lapply(result, function(x) {
      x[is.na(x)] <- mean(x, na.rm = T)
      x
    })
    return(result)
  }
  Mean_miss = Mean_wrapper(e_t)
  sum(is.na(Mean_miss))

  Median_wrapper <- function(data) {
    result <- data
    result[] <- lapply(result, function(x) {
      x[is.na(x)] <- median(x, na.rm = T)
      x
    })
    return(result)
  }
  Median_miss = Median_wrapper(e_t)
  sum(is.na(Median_miss))




  HM_wrapper <- function(data) {
    result <- data
    result[] <- lapply(result, function(x) {
      x[is.na(x)] <- min(x, na.rm = T)/2
      x
    })
    return(result)
  }
  HM_miss = HM_wrapper(e_t)
  sum(is.na(HM_miss))

  Zero_wrapper <- function(data) {
    result <- data
    result[is.na(result)] <- 0
    return(result)
  }
  Zero_miss = Zero_wrapper(e_t)
  sum(is.na(Zero_miss))

  QRILC_wrapper <- function(data, ...) {
    result <- data.matrix(data) %>% log %>% impute.QRILC.moderate %>% extract2(1) %>% exp
    return(result)
  }
  e_t[e_t==0] = 1
  QRILC_miss = QRILC_wrapper(e_t)
  sum(is.na(QRILC_miss))






  pacman::p_load(missForest, imputeLCMD, magrittr, foreach, doParallel, MASS)



  ## Draw n samples from a truncated normal distribution N(mu, std^2|[lo, hi]) ##
  rnorm_trunc <- function (n, mu, std, lo=-Inf, hi=Inf) {
    p_lo <- pnorm(lo, mu, std)
    p_hi <- pnorm(hi, mu, std)
    u <- runif(n, p_lo, p_hi)
    return(qnorm(u, mu, std))
  }

  ## Initialize the missing data ##
  ## lsym will draw samples from the right tail of the distribution and transformed to the left tail
  miss_init <- function(miss_data, method=c('lsym', 'qrilc', 'rsym')[1]) {
    init_data <- miss_data
    if (method=='lsym') {
      for (i in 1:ncol(init_data)) {
        col_temp <- init_data[, i]
        na_idx <- which(is.na(col_temp))
        prop <- mean(is.na(col_temp))
        min_temp <- min(col_temp, na.rm=T)
        col_temp[na_idx] <- min_temp - 1
        med_temp <- median(col_temp)
        col_temp[na_idx] <- med_temp - (sample(col_temp[col_temp >= quantile(col_temp, 1-prop)], length(na_idx), replace=T) - med_temp)
        init_data[, i] <- col_temp
      }
    }
    if (method=='rsym') {
      for (i in 1:ncol(init_data)) {
        col_temp <- init_data[, i]
        na_idx <- which(is.na(col_temp))
        prop <- mean(is.na(col_temp))
        max_temp <- max(col_temp, na.rm=T)
        col_temp[na_idx] <- max_temp + 1
        med_temp <- median(col_temp)
        col_temp[na_idx] <- med_temp + (med_temp - sample(col_temp[col_temp<=quantile(col_temp, prop)], length(na_idx), replace=T))
        init_data[, i] <- col_temp
      }
    }
    if (method=='qrilc') {
      init_data <- impute.QRILC(miss_data)[[1]]
    }
    return(init_data)
  }

  ## Single missing variable imputation based on Gibbs sampler ##
  single_impute_iters <- function(x, y, y_miss, y_real=NULL, imp_model='glmnet_pred', lo=-Inf, hi=Inf, iters_each=100, gibbs=c()) {
    y_res <- y
    x <- as.matrix(x)
    na_idx <- which(is.na(y_miss))
    imp_model_func <- getFunction(imp_model)
    nrmse_vec <- c()
    gibbs_res <- array(NA, dim=c(3, length(gibbs), iters_each))
    dimnames(gibbs_res) <- list(c('std', 'yhat', 'yres'), NULL, NULL)

    for (i in 1:iters_each) {
      y_hat <- imp_model_func(x, y_res)
      std <- sqrt(sum((y_hat[na_idx]-y_res[na_idx])^2)/length(na_idx))
      y_res[na_idx] <- rnorm_trunc(length(na_idx), y_hat[na_idx], std, lo, hi)
      if (length(gibbs)>0) {
        gibbs_res[1, , i] <- std
        gibbs_res[2, , i] <- y_hat[gibbs]
        gibbs_res[3, , i] <- y_res[gibbs]
      }
      ## The following code is for prediction function testing when y_real availabe ##
      if (!is.null(y_real)) {
        Sys.sleep(.5)
        par(mfrow=c(2, 2))
        nrmse_vec <- c(nrmse_vec, nrmse(y_res, y_miss, y_real))
        plot(y_real~y_res)
        plot(y_real~y_hat)
        plot(y_hat~y_res)
        plot(nrmse_vec)
      }
    }
    return(list(y_imp=y_res, gibbs_res=gibbs_res))
  }


  ## Multiple missing variables imputation ##
  ## iters_each=number (100); vector of numbers, e.g. rep(100, 20) while iters_all=20
  ## lo/hi=numer; vector; functions like min/max/median/mean...
  ## initial=character ('qrilc'/'lysm'); initialized data maatrix
  ## n_cores=1 is sequentially (non-parallel) computing
  multi_impute <- function(data_miss, iters_each=100, iters_all=20, initial='qrilc', lo=-Inf, hi='min',
                           n_cores=1, imp_model='glmnet_pred', gibbs=data.frame(row=integer(), col=integer())) {
    ## Convert to data.frame ##
    data_miss %<>% data.frame()

    ## Make vector for iters_each ##
    if (length(iters_each)==1) {
      iters_each <- rep(iters_each, iters_all)
    } else if (length(iters_each)==iters_all) {
      iters_each <- iters_each
    } else {stop('improper argument: iters_each')}


    ## Missing count in each column ##
    miss_count <- data_miss %>% apply(., 2, function(x) sum(is.na(x)))
    ## Index of missing variables, sorted (increasing) by the number of missings
    miss_col_idx <- order(miss_count, decreasing = T) %>% extract(1:sum(miss_count!=0)) %>% rev()

    if (!all(gibbs$col %in% miss_col_idx)) {stop('improper argument: gibbs')}
    gibbs_sort <- gibbs
    if (nrow(gibbs_sort)>0) {
      gibbs_sort$order <- c(1:nrow(gibbs_sort))
      gibbs_sort <- gibbs_sort[order(gibbs_sort$row), ]
      gibbs_sort <- gibbs_sort[order(match(gibbs_sort$col, miss_col_idx)), ]
    } else {gibbs_sort$order <- integer()}

    ## Make vectors for lo and hi ##
    if (length(lo)>1) {
      if (length(lo)!=ncol(data_miss)) {stop('Length of lo should equal to one or the number of variables')}
      else {lo_vec <- lo}
    } else if (is.numeric(lo)) {
      lo_vec <- rep(lo, ncol(data_miss))
    } else if (is.character(lo)) {
      lo_fun <- getFunction(lo)
      lo_vec <- apply(data_miss, 2, function(x) x %>% na.omit %>% lo_fun)
    }

    if (length(hi)>1) {
      if (length(hi)!=ncol(data_miss)) {stop('Length of hi should equal to one or the number of variables')}
      else {hi_vec <- hi}
    } else if (is.numeric(hi)) {
      hi_vec <- rep(hi, ncol(data_miss))
    } else if (is.character(hi)) {
      hi_fun <- getFunction(hi)
      hi_vec <- apply(data_miss, 2, function(x) x %>% na.omit %>% hi_fun)
    }

    # Check whether lo is lower than hi
    if(!all(lo_vec < hi_vec)) {stop('lo should be lower than hi')}

    ## Initialization using build-in method or input initial matrix ##
    if(is.character(initial)) {
      data_init <- miss_init(data_miss, method=initial)
    } else if(is.data.frame(initial) & identical(data_miss[!is.na(data_miss)], initial[!is.na(data_miss)])) {
      data_init <- initial
    } else {stop('improper argument: initial')}

    data_imp <- data_init
    gibbs_res_final <- array(NA, dim=c(3, nrow(gibbs), 0))

    ## Iterations for the whole data matrix ##
    for (i in 1:iters_all) {
      cat('Iteration', i, 'start...')

      ## Parallel computing ##
      if (n_cores>1) {
        cat(paste0('Parallel computing (n_cores=', n_cores, ')...'))
        ## Parallel on missing variables
        cl <- makeCluster(n_cores)
        registerDoParallel(cl)
        core_res <- foreach (k=miss_col_idx, .combine='cbind_abind', .export=c('single_impute_iters', 'rnorm_trunc'), .packages=c('magrittr')) %dopar% {
          source('Prediction_funcs.R')
          gibbs_sort_temp <- gibbs_sort[gibbs_sort$col==k, ]
          y_imp_res <- single_impute_iters(data_imp[, -k], data_imp[, k], data_miss[, k], imp_model=imp_model,
                                           lo=lo_vec[k], hi=hi_vec[k], iters_each=iters_each[i], gibbs=gibbs_sort_temp$row)
          y_imp_df <- y_imp_res$y_imp %>% data.frame
          colnames(y_imp_df) <- colnames(data_miss)[k]
          gibbs_res <- y_imp_res$gibbs_res
          list(y_imp=y_imp_df, gibbs_res=gibbs_res)
        }
        stopCluster(cl)
        y_imp_df <- core_res$y_imp
        gibbs_res_final <- abind(gibbs_res_final, core_res$gibbs_res, along=3)
        miss_col_idx_match <- match(colnames(y_imp_df), colnames(data_miss))
        data_imp[, miss_col_idx_match] <- y_imp_df
      } else {
        ## Sequential computing ##
        gibbs_res_j <- array(NA, dim=c(3, 0, iters_each[i]))
        for (j in miss_col_idx) {
          gibbs_sort_temp <- gibbs_sort[gibbs_sort$col==j, ]
          y_miss <- data_miss[, j]
          y_imp_res <- single_impute_iters(data_imp[, -j], data_imp[, j], y_miss, imp_model=imp_model, lo=lo_vec[j], hi=hi_vec[j],
                                           iters_each=iters_each[i], gibbs=gibbs_sort_temp$row)
          y_imp <- y_imp_res$y_imp
          gibbs_res_j <- abind(gibbs_res_j, y_imp_res$gibbs_res, along=2)
          data_imp[is.na(y_miss), j] <- y_imp[is.na(y_miss)]
        }
        gibbs_res_final <- abind(gibbs_res_final, gibbs_res_j, along=3)
      }
      cat('end!\n')
    }
    gibbs_res_final_reorder <- gibbs_res_final[, gibbs_sort$order, ]
    return(list(data_imp=data_imp, gibbs_res=gibbs_res_final_reorder))
  }


  # GS_impute ---------------------------------------------------------------
  GS_impute <- multi_impute



  # pre_processing_GS_wrapper -----------------------------------------------
  pre_processing_GS_wrapper <- function(data) {
    data_raw <- data.matrix(data)
    ## log transformation ##
    data_raw_log <- data_raw %>% log()
    ## Initialization ##
    data_raw_log_qrilc <- impute.QRILC.moderate(data_raw_log) %>% extract2(1)
    const_column_index = which(apply(data_raw_log_qrilc,2,function(x){length(unique(x))})<3)
    for(i in const_column_index){
      data_raw_log_qrilc[,i] = rnorm(length(data_raw_log_qrilc[,i]),mean(data_raw_log_qrilc[,i]),sd=0.01)
    }
    ## Centralization and scaling ##
    data_raw_log_qrilc_sc <- scale_recover(data.table(data_raw_log_qrilc), method = 'scale')
    ## Data after centralization and scaling ##
    data_raw_log_qrilc_sc_df <- data_raw_log_qrilc_sc[[1]]
    ## Parameters for centralization and scaling ##
    ## For scaling recovery ##
    data_raw_log_qrilc_sc_df_param <- data_raw_log_qrilc_sc[[2]]
    ## NA position ##
    NA_pos <- which(is.na(data_raw), arr.ind = T)
    ## bala bala bala ##
    data_raw_log_sc <- data_raw_log_qrilc_sc_df
    data_raw_log_sc[NA_pos] <- NA
    ## GSimp imputation with initialized data and missing data ##
    result <- data.matrix(data_raw_log_sc) %>% GS_impute(., iters_each=50, iters_all=10,
                                            initial = 'qrilc',
                                            lo=-Inf, hi= 'min', n_cores=2,
                                            imp_model='glmnet_pred')
    data_imp_log_sc <- result$data_imp
    ## Data recovery ##
    data_imp <- data_imp_log_sc %>%
      scale_recover(., method = 'recover',
                    param_df = data_raw_log_qrilc_sc_df_param) %>%
      extract2(1) %>% exp()
    return(data_imp)
  }

  pre_processing_GS_wrapper(e_t)


























}
