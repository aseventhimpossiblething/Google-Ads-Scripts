

var SpreadsheetURL="https://docs.google.com/spreadsheets/d/10oE3zbVcKXv_bQnW1_g2UPdzOeSv2zzLlUjuCYmq07s/edit#gid=0"

var AccountName = AdsApp.currentAccount().getName()

var aclearSheet=SpreadsheetApp.openByUrl(SpreadsheetURL).getNumSheets()
//var bclearSheet=SpreadsheetApp.openByUrl(SpreadsheetURL).deleteActiveSheet()
var clearSheet=SpreadsheetApp.openByUrl(SpreadsheetURL).getActiveSheet().clear();
var ExludeFromKeywordRecommendations=[];
var ExcludeFromNegativeKeywordRecommendations=[];

//these variables will hold the keyword recommendations and associated metrics
var Possible_New_Keywords_Query=["Query"];
var PNKeywords=["Keywords"]; 
var PNCampaign=["Campaign"];
var PNAdgroup=["Adgroup"];
var PNMatch_Type=["Match Type of original keyword"];
var PNCost=["Cost"];
var PNClicks=["Clicks"];
var PNCPC=["Cost / Click"];
var PNConversions=["Conversions"];
var PNImpressions=["Impressions"];
var PNURL=["URL"];

//The Below Array will be used in the sheet insertion
var PositiveWords=[
  A=Possible_New_Keywords_Query,
  B=PNKeywords,
  C=PNCampaign,
  D=PNAdgroup,
  E=PNMatch_Type,
  F=PNCost,
  G=PNClicks,
  H=PNCPC,
  I=PNConversions,
  J=PNImpressions,
  K=PNURL
];




//These variables hold intermediate metrics that will not be displayed. They are processed into the Negative Keyword Recommendations
var lvl1Possible_Negative_Keywords=[];
var tempKeywords=[]; 
var tempCampaign=[];
var tempAdgroup=[];
var tempMatch_Type=[];

//These variables are displayed as the negative keyword recommendations and their associated metrics
var Possible_Negative_Keywords=["query{review for possible negatives}"];
var candidatefornegativeKeywords=["original keyword{modify}"];//keywords of these Queries 
var candidatefornegativeCampaign=["Campaign"];
var candidatefornegativeAdgroup=["Adgroup of original keyword"];
var candidatefornegativeMatch_Type=["Match Type of original keyword"];
var candidatefornegativeCost=["Cost"];
var candidatefornegativeCPC=["Cost/Click"];
var candidatefornegativeClicks=["Clicks"];
var candidatefornegativeConversions=["Conversions"];
var candidatefornegativeImpressions=["Impressions"];
var candidatefornegativeURL=["URL"];

//Negative Words to be inserted
var NegativeWords=[
A=Possible_Negative_Keywords,
B=candidatefornegativeKeywords, 
C=candidatefornegativeCampaign,
D=candidatefornegativeAdgroup,
F=candidatefornegativeMatch_Type,
E=candidatefornegativeCost,
F=candidatefornegativeClicks,
G=candidatefornegativeCPC,  
H=candidatefornegativeConversions,
I=candidatefornegativeImpressions,
J=candidatefornegativeURL
  ];


//function that checks to see if members exluded list are in the keyword string and sets a go flag is clear
function goFlag(term,arraychecked){
term=term.toLowerCase();
var flag=0; 
for(memb=0;memb<arraychecked.length;memb++){if(term.indexOf(arraychecked[memb])!=-1){flag++}
            }
if(flag==0){ return "clear";} else {return "not clear";}}






function main(){
//Logger.log(AdsApp.currentAccount().getName()) 


while(SpreadsheetApp.openByUrl(SpreadsheetURL).getNumSheets()!=1){SpreadsheetApp.openByUrl(SpreadsheetURL).deleteActiveSheet()};  
  
 

 //this pulls the Query report  
var Query1 = AdsApp.report("SELECT Query, KeywordTextMatchingQuery, QueryMatchTypeWithVariant, Cost, Clicks, Conversions, Impressions, Ctr, CampaignName, AdGroupName, FinalUrl "+"FROM SEARCH_QUERY_PERFORMANCE_REPORT "+"DURING LAST_30_DAYS");
QueryRoller=Query1.rows()


  
//This is the Queryiterator that parses values pulled from the report   
while(QueryRoller.hasNext()){NextQuery=QueryRoller.next();
var CPL=NextQuery.Cost/NextQuery.Conversions
var CTR=parseFloat(NextQuery.Ctr.replace("%",""))
var Conversions=NextQuery.Conversions
var Cost=NextQuery.Cost
var Clicks=NextQuery.Clicks
var Word=NextQuery.Query
var CPC=NextQuery.Cost/Clicks
var AdURL=NextQuery.FinalUrl


//This Filters out the data from the report and assigns it to the variables listed at the top of the script
if(Conversions>2){Possible_New_Keywords_Query.push(NextQuery.Query);PNKeywords.push(NextQuery.KeywordTextMatchingQuery);PNCampaign.push(NextQuery.CampaignName);PNAdgroup.push(NextQuery.AdGroupName);PNMatch_Type.push(NextQuery.QueryMatchTypeWithVariant);PNCost.push(NextQuery.Cost);PNClicks.push(NextQuery.Clicks); PNCPC.push(CPC);PNConversions.push(NextQuery.Conversions);PNImpressions.push(NextQuery.Impressions);PNURL.push(AdURL)}                       
if(Conversions==0&&Clicks>4){lvl1Possible_Negative_Keywords.push(NextQuery.Query);tempKeywords.push(NextQuery.KeywordTextMatchingQuery);tempCampaign.push(NextQuery.CampaignName);tempAdgroup.push(NextQuery.AdGroupName);tempMatch_Type.push(NextQuery.QueryMatchTypeWithVariant);}
                                             }
  
//Logger.log('between Quesries'+" "+goFlag(Word,ExludeFromKeywordRecommendations)+" "+goFlag(Word,ExcludeFromNegativeKeywordRecommendations))   
//Logger.log('Possible_New_Keywords_Query'+' '+Possible_New_Keywords_Query) 
//Logger.log(Possible_Negative_Keywords+' '+Possible_Negative_Keywords) 
//Logger.log(lvl1Possible_Negative_Keywords.length+' lvl1Possible_Negative_Keywords '+lvl1Possible_Negative_Keywords)  

//Logger.log(CPC)
//Logger.log(AdURL)
//Logger.log(NextQuery)

  
  
  
if(lvl1Possible_Negative_Keywords.length!==0){var Query2 = AdsApp.report("SELECT Query, KeywordTextMatchingQuery, QueryMatchTypeWithVariant, Cost, Clicks, Conversions, Impressions, Ctr, CampaignName, AdGroupName, FinalUrl "+"FROM SEARCH_QUERY_PERFORMANCE_REPORT "+"DURING LAST_MONTH");
Query2Roller=Query2.rows()
while(Query2Roller.hasNext()){NextQuery2Roller=Query2Roller.next(); 
var cnCPC=NextQuery2Roller.Cost/NextQuery2Roller.Clicks 
var cnCost=NextQuery2Roller.Cost
var cnCLicks=NextQuery2Roller.Clicks
//if(lvl1Possible_Negative_Keywords.indexOf(NextQuery2Roller.Query)!==-1)
//Logger.log(lvl1Possible_Negative_Keywords.indexOf(NextQuery2Roller.Query))  
//var cnCPC=NextQuery2Roller.Cost/NextQuery2Roller.Clicks  
//Logger.log('lvl1Possible_Negative_Keywords.indexOf(NextQuery2Roller.Query) '+lvl1Possible_Negative_Keywords.indexOf(NextQuery2Roller.Query))
if(lvl1Possible_Negative_Keywords.indexOf(NextQuery2Roller.Query)!=-1&&NextQuery2Roller.Conversions==0&&cnCost>500&&cnCLicks>4){Possible_Negative_Keywords.push(NextQuery2Roller.Query);candidatefornegativeKeywords.push(NextQuery2Roller.KeywordTextMatchingQuery);candidatefornegativeCampaign.push(NextQuery2Roller.CampaignName);candidatefornegativeAdgroup.push(NextQuery2Roller.AdGroupName);candidatefornegativeMatch_Type.push(NextQuery2Roller.QueryMatchTypeWithVariant);candidatefornegativeCost.push(NextQuery2Roller.Cost);candidatefornegativeClicks.push(NextQuery2Roller.Clicks);candidatefornegativeCPC.push(NextQuery2Roller.Cost/NextQuery2Roller.Clicks);candidatefornegativeConversions.push(NextQuery2Roller.Conversions);candidatefornegativeImpressions.push(NextQuery2Roller.Impressions);candidatefornegativeURL.push(NextQuery2Roller.FinalUrl)}
                                             }}                             
                             

              
                             
var sheetinsertion=function(keywordDimension,column){
var thiscounter;  
for(thiscounter=0;thiscounter<keywordDimension.length;thiscounter++){
var arrayA=keywordDimension
var A=column
var B=1+thiscounter   
var sheetroller=SpreadsheetApp.openByUrl(SpreadsheetURL).getActiveSheet().getRange(A+B).setValue(arrayA[thiscounter])  
/*Logger.log(thiscounter+"  "+arrayA[thiscounter] )*/   }
}



var ArrayParser=function(targetArray,PositiveOrNegativeString){
  
  for(Arrcount=0;Arrcount<targetArray.length;Arrcount++){
   Letter=String.fromCharCode(Arrcount+65);
   sheetinsertion(targetArray[Arrcount],Letter); 
       }
SpreadsheetApp.openByUrl(SpreadsheetURL).duplicateActiveSheet().setName(AccountName+" "+PositiveOrNegativeString+" keyword recommendations "+Date())}
ArrayParser(PositiveWords,"Positive") 
ArrayParser(NegativeWords,"Negative")  
  


  
  
  
//MailApp.sendEmail("Mcherisol@theBDX.com","Alert BDX-PPC Budget Monitor Script has met or exceeded its Budget of Total spend at this point is $")    


MailApp.sendEmail("Mcherisol@AdvancedRecoverySystems.com","Do Not Reply", "Keyword report "+AccountName, "Keyword report for "+AccountName+" is ready at the following Link "+SpreadsheetURL+" This sheet runs on the 28th of each month.    Thank You") 
MailApp.sendEmail("TCastanheira@advancedrecoverysystems.com","Do Not Reply", "Keyword report "+AccountName, "Keyword report for "+AccountName+" is ready at the following Link "+SpreadsheetURL+" This sheet runs on the 28th of each month.    Thank You") 

Logger.log(SpreadsheetURL)  
}  
                         
 
  
