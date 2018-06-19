# Reported Sexual Harassment Incidents by Academic Discipline

*SI 649: Information Visualization, Section 001, Winter 2018*  
*Group 3: Wilson Parson, Kristen Mcgarry, and Thanhthu (Tammy) Nguyen*

This is a group project for SI 649: Information Visualization at University of Michigan School of Information. The data used for the project are taken from a survey created by Karen Kelsky, PhD: [Sexual Harassment In the Academy: An Anonymous Crowdsourced Survey](https://docs.google.com/forms/d/e/1FAIpQLSeqWdpDxVRc-i8OiiClJPluIpjMlM41aUlU2E0rrQ4br_rQmA/viewform). Live survey results can be found at [Sexual Harassment In the Academy: An Anonymous Crowdsourced Survey (Live Submissions Google Sheet)](https://docs.google.com/spreadsheets/d/1S9KShDLvU7C-KkgEevYTHXr3F6InTenrBsS9yk-8C5M/edit#gid=1530077352).

# Table of Contents
- [Executive Summary](#executive-summary)
    - [Project Overview](#project-overview)
    - [Audience](#audience)
- [Questionnaire](#questionnaire)
    1. [Data](#1-data)
    2. [Tasks/Learning Goals](#2-tasks-learning-goals)
    3. [Encodings](#3-encodings)
    4. [Effectiveness](#4-effectiveness)
    5. [Narrative/Use of Text](#5-narrative-use-of-text)
    6. [Interactivity](#6-interactivity)
    7. [Limitations](#7-limitations)


# Executive Summary

## Team Members
Wilson Parson, Kristen Mcgarry, and Thanhthu (Tammy) Nguyen

## Project Overview
Upon initial exploration of the “Sexual Harassment in Academia” data set and of the barebones tool that exists for exploring the data, we quickly came to the decision that what was aggregated here needed to be communicated more effectively—specifically to bring awareness to the hidden sexual misconduct that occurs in academia. We decided to focus on a specific subset of the data—the event itself, the role/rank of the target, the role/rank of the perpetrator, the academic discipline that the victim and/or perpetrator belongs/belonged to, and the power difference/gap between the target and perpetrator—with the goals of revealing which academic disciplines appear to have a higher incidences of sexual misconduct, which academic rank appear to be most frequently committing sexual harassment, revealing the imbalance and abuse of power in a majority of these accounts, and humanizing the data by allowing our audience to read these personal stories of abuse.

Our design features a series of bar graph visualizations that possess the functionality to filter and sort the data by rank/role. The starting visualizations depict the role/rank of victims or perpetrators so our audience can identify which role/rank appears to be most at risk of sexual harassment/assault and where a majority of the abusers come from. The user also has the option of filtering the data to view incidents within a specific rank/role. The data is further organized by academic discipline to order the academic fields by number of reported incidents. We also include a visualization that communicates the power gap between victim and perpetrator using a diverging color scale; this scale allows the user(s) to identify trends and patterns in power dynamics relative to cases of sexual misconduct.

Our final communication goal is to allow our user to read each of these individual accounts so that they may understand the size and scope of the issue of sexual harassment/assault in academia and to provide victims a space to share their story without fear of repercussions. Reading these stories not only reveals the severity of the sexual abuse that occurs but also the systematic protection and valuing of the abusers over the victims.

## Audience
Our intended primary audience for our visualizations are university administrators (deans, chairs, and department heads). By effectively communicating this aggregated data to university administrators about the size, severity, and cultural norms of sexual misconduct in academia, we hope to facilitate more conversation about it and to spur administrators to create more effective institutional policies and interventions. Hopefully through our visualization, we can help generate some impact in the pervasive sexual misconduct in academia.


# Questionnaire

## 1. Data

> What is your data?

Dr. Karen Kelsky, a former anthropology professor, created an anonymous crowdsourced survey, “Sexual Harassment in the Academy”, to allow victims of sexual harassment and/or assault a space to report their experience without fear of repercussions.

Aggregating the data in the form of personal stories, the dataset includes information about the nature of the abuse, what rank/role the victim and perpetrator were, the academic discipline in which the victim/perpetrator belonged to, what recourse (if any) was taken, how the institution responded, what punishment (if any) was given, and the effects on the victim’s career, mental health, and life that occurred as a result of this abuse.

The data is primarily nominal and open to different types of interpretation. Due to these inconsistencies, our first task was to clean the data. Using some basic natural language processing, we pulled from the description of the incident, the rank of both victim and perpetrator and made sure it aligned with what was submitted. Additionally, to order and organize our data by rank, we attached a quantitative value to each rank.

Not disclosed was given a rank of 0 and students, as they rose through the academic system (K-12, Undergraduate, Graduate, Masters, and PhD), were each given a value of 1. Under the category of faculty, this includes all technicians, lecturers, and instructors, as well as any adjunct or visiting professors because we feel that they hold temporary status at an institution. Assistant professors are those who were just starting their academic teaching career and associate professors are those who are tenure-tracked. Administrative includes all deans, chairs, and department heads who might hold more power in the office over other tenured professors.

Our dataset does include some information about academic disciplines, but still required additional cleaning. After each instance was consistently labelled, we excluded all disciplines with 20 or less total instances, given the small sample size.

## 2. Tasks/Learning Goals

> What are the tasks or learning goals you want to support?  
> What should someone be able to understand after seeing / using your visualization?

Our overarching communication goal is to show how much sexual misconduct occurs in academia as a result of the hierarchal imbalance of power. Our users should be able to determine which academic disciplines appear to have a higher incidence of sexual misconduct (which can be further filtered by the rank/role of the victim or perpetrator) and understand the impact that the imbalance of power in a majority of these accounts. Lastly, we hope by allowing our users to read through the individual reported accounts, they will see the impact of sexual harassment and lack of support for sexual harassment victims in academia.

## 3. Encodings
> How are you encoding the data visually?

Utilizing a bar chart design, we have discipline positioned on the y-axis and the value/number of sexual harassment/assault incidents on the x-axis. To differentiate between rank/role of the victim and perpetrator and to communicate the imbalance of power in these reports, we use color to help convey this message. In our power gap visualization, we use a diverging color scale of brown and teal; brown being a case where the victim possesses a higher rank over the perpetrator and teal where the perpetrator was in a position of power over the victim. This power gap was determined by assigning a numerical value from 1-11 in order of education rank and subtracting the target’s rank value from the perpetrator’s. Additionally, to communicate that each value in our dataset represents the the real and raw experience of a recipient of sexual harassment/assault, we encoded each story/experience as a dot.

## 4. Effectiveness
> Why is your solution effective?

Currently, there is a functioning solution created by Dr. David R. Karger, an MIT Professor, with the Computer Science and Artificial Intelligence Laboratory, so our goal was to create a more effective solution. Dr Karger created a [barebones tool](http://people.csail.mit.edu/karger/Exhibit/Harass/) that allows users to explore the dataset; this tool is primarily text-based and presents the data in a somewhat readable format. There is some added functionality that allows the user to filter the data displayed by response (null/yes/no), perpetrator gender (null/male/female/ other), target status, target prefix, discipline, institution, institution type, and discipline prefix. Additionally, the user may also sort the data displayed by submission times and or disciplines, institutions, institution type, perpetrator gender, perpetrator role, and responses.

As the dataset is crowdsourced, there are a plethora of inconsistencies among the submissions and unfortunately as a result, it means that Dr. Karger’s tool processes data and displays values dissonantly. This tool asks the user to read through each account but does little to aggregate or compare the reported entries; however, this tool does, communicate successfully how big an issue sexual assault in academia is.

With our solution, we also wanted to communicate a similar message but wished to refine it so it is both visually compelling and impactful. By utilizing a stacked bar chart to represent the data and by encoding each data point as a dot on our visualization, our intention was to immediately communicate to our audience and to create understanding of the prevalence and sheer amount of sexual harassment in academia. Additionally, rather than having the audience try to compare and track the incidents by rank/role and discipline, using our filtering and sorting functionalities, we also allow the audience to quickly perceive the differences.

The second element in our visualization is the power gap view. By ranking and then valuing each reported incident with a number, we effectively communicate how the entrenched hierarchy in academia has resulted in a great abuse of power. Rather than just communicating how big the problem is, we have highlighted one potential significant reason for the rampant sexual misconduct in academia and have potentially prompted our audience to question why these cultural norms and acceptance about sexual assault in academic exist.

Perhaps the most effectively presentation our data and the message we feel the data presents is in the exploratory aspect of our visualization. We allow our audience to select an individual data point and to read the victim’s actual account/narrative. We feel that this aspect of our solution is what is most impactful and striking to our audience as it humanizes our data and frames it in a sobering context.

## 5. Narrative/Use of Text
> How are you using text to support your visualization?  
> Do you have any narrative structure in mind?

For our visualization, we are using text in two distinct ways: (1) guide the user through the visualization, and (2) providing a platform for sexual harassment victims to share their stories. 

First, when the user enters into our visualization, we have a text blurb in the center of the page, providing the context of our analysis. Once the user enters our visualization, each sub-visualization, contains background information and some conclusions drawn, that allows the user to follow along.

Second, our intention is to first show/tell the user how large this problem is in academia and then to display the verbatim text during the exploration phase of our solution to allow each victim to describe their own experience in their own words. If the user clicks on a given dot, a text box appears in place of the initial background information providing detailed verbatim of the incident that occured.

## 6. Interactivity
> How are you using interactivity (if at all)?
> Why does it support your task?

Our solution allows users to switch between three different views, to filter by target or perpetrator role, and to select the individual points to read details about each event through elaboration. We chose to use interactivity to present the three different views, rather than an alternative method like small multiples, because the individual points are sorted differently in each of the three views. To make this difference in sorting order clear to user(s), we use staged transitions to first change the color hue of the points (according to the scale of the selected view), and then change the position of the points.

For filtering by target or perpetrator status, we chose to use a dynamic baseline approach, moving the points from the selected category towards the y-axis to allow for better comparison of the filtered value between academic disciplines. We also used staged transitions here, first reducing the opacity of the points not in the selected category, and then changing the position of the points.

Finally, we chose to use interactivity to allow users to obtain details on demand for each of the incidents through elaboration. When a user selects a point from the plot, they are shown a table containing information about that particular incident, including the target status, the perpetrator status, the description of the incident, the institution where it took place, the institutional response to the incident, and the impact of the event on the target’s life, career, and mental health. By allowing users to read about each incident, we are preserving the qualitative nature of the survey responses, which we believe helps to (1) humanize the data, and (2) elicit a stronger response from the user(s).

## 7. Limitations
> What are the limitations of your solution?

As the dataset is voluntary crowdsourced, our data is somewhat bias as it represents only the incidents that victims have chosen to report. For example, while English appears to be the discipline with the most incidents of sexual harassment, it’s a possible that other disciplines, like STEM, have an equivalent number of cases of sexual misconduct, but cultural norms within STEM fields may prevent victims from reporting, even anonymously. Furthermore, while the gender of the perpetrator is given, the survey doesn’t ask for the gender of the victim; it is normatively implied that a majority of the victims are women.




