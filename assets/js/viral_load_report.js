/**
 * Loads data into a viral load table from remote API
 */

 function viral_load_table(dom_table) {
     console.log('Attempting to populate viral load table:');
     console.log(dom_table);

     if (dom_table === null) return;

     /**
      * Retrieve report from remote API. 
      */
     function retrieve_report(on_success_callback) {
         // TODO: Connect to API and retrieve report then pass it to the on success function

         console.log('Retrieving report...')

        // STUB
         on_success_callback({
             reason_for_test__routine: 10,
             reason_for_test__targeted: 20,
             reason_for_test__follow_up_after_high_viral_load: 5,
             reason_for_test__repeat: 0,
             total_samples: 35,
             client_notification__0_4_weeks: 10,
             client_notification__5_8_weeks: 5,
             client_notification__9_12_weeks: 5,
             client_notification__13_weeks_plus_or_missing: 15,
             total_client_notification_samples: 35,
             initial_decision__pending: 10,
             initial_decision__cont_current_regimen: 20,
             initial_decision__switch: 5,
             total_high_viral_load_patients: 35,
             receipt_of_results__0_4_weeks: 5,
             receipt_of_results__5_8_weeks: 10,
             receipt_of_results__9_12_weeks: 15,
             receipt_of_results__13_plus_weeks_or_missing: 5,
             total_samples: 35,
             initial_high_viral_load__reason_for_test__routine: 10,
             initial_high_viral_load__reason_for_test__targeted: 10,
             initial_high_viral_load__reason_for_test__repeat: 15,
             final_decision__final_decision_pending: 5,
             final_decision__cont_current_regimen: 10,
             final_decision__switch: 15,
             final_decision__refer_to_hiv_specialist: 5,
             results_type__electronic: 10,
             results_type__paper: 10,
             results_type__missing_results: 15,
             total_clients: 35,
             intensive_adherence_counselling__3_sessions_completed: 30,
             intensive_adherence_counselling__sess_not_completed: 5,
             viral_load_results__less_than_1000: 15,
             viral_load_results__more_than_1000: 20,
             viral_load_results__samples_rejected: 10,
             viral_load_results__results_missing: 20,
             total_viral_load_results: 55,
             follow_up_viral_load_results__not_yet_collected: 5,
             follow_up_viral_load_results__less_than_1000: 10,
             follow_up_viral_load_results__samples_rejected: 15,
             follow_up_viral_load_results__results_missing: 5
         });
     }

     function build_report(data) {
         console.log('Building report from: ');
         console.log(data);

         for (const [key, value] of Object.entries(data)) {
             console.log(`Loading ${key} => ${value}`);
             const fields = dom_table.querySelectorAll(`.${key}`);
             foreach_dom_element(fields, (elem) => { elem.innerHTML = value });
         }
     }

     /**
      * A foreach statement for iterating DOM collections.
      * 
      * @param{visitor} is a function that gets called for each dom element
      */
     function foreach_dom_element(collection, visitor) {
         console.log(collection);
         for (let i = 0; i < collection.length; i++) {
             visitor(collection[i]);
         }
     }

     retrieve_report(build_report);
 }

 viral_load_table(document);