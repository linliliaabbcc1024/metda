function config($mdIconProvider, $mdThemingProvider, $stateProvider,cfpLoadingBarProvider, $provide) {

            // Decorate the $mdDialog service using $provide.decorator
            $provide.decorator("$mdDialog", function ($delegate) {
                // Get a handle of the show method
                var methodHandle = $delegate.show;
                function decorateDialogShow () {
                    var args = angular.extend({}, arguments[0], { multiple: true })
                    return methodHandle(args);
                }
                $delegate.show = decorateDialogShow;
                return $delegate;
            })

            cfpLoadingBarProvider.includeSpinner = true;
            cfpLoadingBarProvider.includeBar = true;
            cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>';


        $mdIconProvider
          .iconSet("call", 'img/icons/sets/communication-icons.svg', 24)
          .iconSet("social", 'img/icons/sets/social-icons.svg', 24);
        $mdThemingProvider.theme('default')
          //.primaryPalette('indigo')
          .accentPalette('grey', {'hue-1': '200'});

        $mdThemingProvider.theme('danger')
        .primaryPalette('red')
        .accentPalette('orange');

        $stateProvider
        .state('state1',{
          templateUrl:"views/state1.html",
          data:{
            pageTitle:'state1pageTitle'
          }
        })
        .state('student_t_test_state',{
          templateUrl:"views/student_t_test_state.html",
          data:{
            pageTitle:'Student t test'
          }
        })
        .state('welch_t_test_state',{
          templateUrl:"views/welch_t_test_state.html",
          data:{
            pageTitle:'Welch t test'
          }
        })
        .state('paired_t_test_state',{
          templateUrl:"views/paired_t_test_state.html",
          data:{
            pageTitle:'Paired t test'
          }
        })
        .state('wilcoxon_signed_rank_test_state',{
          templateUrl:"views/wilcoxon_signed_rank_test_state.html",
          data:{
            pageTitle:'Wilcoxon Signed Rank test'
          }
        })
        .state('anova_state',{
          templateUrl:"views/anova_state.html",
          data:{
            pageTitle:'ANOVA'
          }
        })
        .state('repeated_anova_state',{
          templateUrl:"views/repeated_anova_state.html",
          data:{
            pageTitle:'Repeated ANOVA'
          }
        })
        .state('friedman_test_state',{
          templateUrl:"views/friedman_test_state.html",
          data:{
            pageTitle:'Friedman test'
          }
        })
        .state('welch_anova_state',{
          templateUrl:"views/welch_anova_state.html",
          data:{
            pageTitle:'Welch ANOVA'
          }
        })
        .state('jonckheere_terpstra_test_state',{
          templateUrl:"views/jonckheere_terpstra_test_state.html",
          data:{
            pageTitle:'Jonckheere-Terpstra test'
          }
        })
        .state('fdr_correction_state',{
          templateUrl:"views/fdr_correction_state.html",
          data:{
            pageTitle:'FDR Correction'
          }
        })
        .state('kruskal_wallis_test_state',{
          templateUrl:"views/kruskal_wallis_test_state.html",
          data:{
            pageTitle:'Kruskal-Wallis test'
          }
        })
        .state('shapiro_wilk_test_state',{
          templateUrl:"views/shapiro_wilk_test_state.html",
          data:{
            pageTitle:'Shapiro-Wilk Normality Test'
          }
        })
        .state('pca_state',{
          templateUrl:"views/pca_state.html",
          data:{
            pageTitle:'Principal Component Analysis'
          }
        })
        .state('loess_normalization_state',{
          templateUrl:"views/loess_normalization_state.html",
          data:{
            pageTitle:'LOESS Normalization'
          }
        })
        .state('serrf_normalization_state',{
          templateUrl:"views/serrf_normalization_state.html",
          data:{
            pageTitle:'SERRF Normalization'
          }
        })
        .state('quantile_normalization_state',{
          templateUrl:"views/quantile_normalization_state.html",
          data:{
            pageTitle:'Quantile Normalization'
          }
        })
        .state('mTIC_state',{
          templateUrl:"views/mTIC_state.html",
          data:{
            pageTitle:'mTIC Normalization'
          }
        })
        .state('sum_normalization_state',{
          templateUrl:"views/sum_normalization_state.html",
          data:{
            pageTitle:'Sum Normalization'
          }
        })
        .state('median_normalization_state',{
          templateUrl:"views/median_normalization_state.html",
          data:{
            pageTitle:'Median Normalization'
          }
        })
        .state('PQN_normalization_state',{
          templateUrl:"views/PQN_normalization_state.html",
          data:{
            pageTitle:'PQN Normalization'
          }
        })
        .state('batchratio_normalization_state',{
          templateUrl:"views/batchratio_normalization_state.html",
          data:{
            pageTitle:'Batch Ratio Normalization'
          }
        })
        .state('cubic_normalization_state',{
          templateUrl:"views/cubic_normalization_state.html",
          data:{
            pageTitle:'Cubic Normalization'
          }
        })
        .state('liwong_normalization_state',{
          templateUrl:"views/liwong_normalization_state.html",
          data:{
            pageTitle:'Li-Wong Normalization'
          }
        })
        .state('linear_normalization_state',{
          templateUrl:"views/linear_normalization_state.html",
          data:{
            pageTitle:'Linear Normalization'
          }
        })
        .state('mtic_normalization_state',{
          templateUrl:"views/mtic_normalization_state.html",
          data:{
            pageTitle:'mTIC normalization'
          }
        })
        .state('log_transformation_state',{
          templateUrl:"views/log_transformation_state.html",
          data:{
            pageTitle:'Log Transformation'
          }
        })
        .state('fold_change_state',{
          templateUrl:"views/fold_change_state.html",
          data:{
            pageTitle:'Fold Change'
          }
        })
        .state('plsda_state',{
          templateUrl:"views/plsda_state.html",
          data:{
            pageTitle:'Partial Least Square - Discriminant Analhysis'
          }
        })
        .state('simple_linear_regression_state',{
          templateUrl:"views/simple_linear_regression_state.html",
          data:{
            pageTitle:'Simple Linear Regression'
          }
        })
        .state('two_way_anova_state',{
          templateUrl:"views/two_way_anova_state.html",
          data:{
            pageTitle:'Two-Way ANOVA'
          }
        })
        .state('two_way_mixed_anova_state',{
          templateUrl:"views/two_way_mixed_anova_state.html",
          data:{
            pageTitle:'Two-Way Mixed ANOVA'
          }
        })
        .state('heatmap_state',{
          templateUrl:"views/heatmap_state.html",
          data:{
            pageTitle:'heatmap'
          }
        })
        .state('subset_state',{
          templateUrl:"views/subset_state.html",
          data:{
            pageTitle:'Dataset Subsetting'
          }
        })
        .state('mann_whitney_u_test_state',{
          templateUrl:"views/mann_whitney_u_test_state.html",
          data:{
            pageTitle:'Mann Whitney U test'
            }
        })
        .state('volcano_plot_state',{
          templateUrl:"views/volcano_plot_state.html",
          data:{
            pageTitle:'Volcano Plot'
            }
        })
        .state("data_attach_state",{
          templateUrl:"views/data_attach_state.html",
          data:{
            pageTitle:"Data Attaching"
          }
        })
        .state("one_way_boxplot_state",{
          templateUrl:"views/one_way_boxplot_state.html",
          data:{
            pageTitle:"One-Way Boxplot"
            }
        })
        .state("one_way_boxplot_admin_state",{
          templateUrl:"views/one_way_boxplot_admin_state.html",
          data:{
            pageTitle:"One-Way Boxplot Admin"
            }
        })
        .state("metamapp_state",{
          templateUrl:"views/metamapp_state.html",
          data:{
            pageTitle:"MetaMapp Pathway Mapping"
            }
        })
        .state("chemrich_state",{
          templateUrl:"views/chemrich_state.html",
          data:{
            pageTitle:"ChemRICH"
            }
        })
        .state("QRILC_state",{
          templateUrl:"views/QRILC_state.html",
          data:{
            pageTitle:"QRILC"
            }
        })
        .state("rm_0_sd_state",{
          templateUrl:"views/rm_0_sd_state.html",
          data:{
            pageTitle:"remove zero standard deviation compound"
            }
       })
       .state("power_transformation_state",{
         templateUrl:"views/power_transformation_state.html",
         data:{
           pageTitle:"Power Transformation"
         }
      })
       .state("boxcox_transformation_state",{
         templateUrl:"views/boxcox_transformation_state.html",
         data:{
           pageTitle:"Box-Cox Transformation"
         }
      })
      .state("outlier_treatment_state",{
        templateUrl:"views/outlier_treatment_state.html",
        data:{
          pageTitle:"Outlier Treatment"
          }
        })
        .state("group_average_state",{
          templateUrl:"views/group_average_state.html",
          data:{
            pageTitle:"Group Average"
          }
        })
      .state("correlation_state",{
        templateUrl:"views/correlation_state.html",
        data:{
          pageTitle:"Correlations"
        }
      })
      .state("RFmiss_state",{
        templateUrl:"views/RFmiss_state.html",
        data:{
          pageTitle:"RFmiss"
          }
        })
      .state("kNNmiss_state",{
        templateUrl:"views/kNNmiss_state.html",
        data:{
          pageTitle:"kNNmiss"
          }
        })
      .state("SVDmiss_state",{
        templateUrl:"views/SVDmiss_state.html",
        data:{
          pageTitle:"SVDmiss"
          }
        })
      .state("constImp_state",{
        templateUrl:"views/constImp_state.html",
        data:{
          pageTitle:"constImp"
          }
        })
      .state("partial_correlation_state",{
        templateUrl:"views/partial_correlation_state.html",
        data:{
          pageTitle:"partial_correlation"
          }
        })














  }

angular
    .module('blankapp')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
