SITUATIONALMAP NP
Real-Time Incident Coordination and Situational Awareness Dashboard for Nepal Police

1. Executive Summary
   SituationalMap NP is a real-time web-based coordination dashboard designed to improve how Nepal Police monitors, reports, and responds to emergencies. It gives officers and command staff one shared live operational map where incidents, resources, and field updates can be tracked instantly instead of being handled through scattered phone calls and delayed manual reports. The system is built to support disaster response, crowd control, and traffic coordination in a simple and practical way that matches real police operations in Nepal.
   The core idea is to convert fragmented field information into one clear operational picture. Officers on the ground can mark incident locations, update severity, and report available resources, while command staff can see what is happening across districts in real time. The system also generates short Nepali situation summaries so command teams can make faster and clearer decisions during fast-moving events.

2. Problem Statement
   Nepal Police often has to manage emergencies where speed, coordination, and accurate shared information are critical. However, current workflows still depend heavily on phone calls, separate reports, and delayed communication, which makes it difficult to maintain a live picture of what is happening across multiple locations. This becomes especially problematic when incidents are unfolding quickly and the situation is changing every few minutes.
   The 2024 floods and landslides showed how difficult coordination can become during large-scale disasters. According to relief reports, Nepal recorded hundreds of deaths and injuries, with more than 17,000 people rescued and over 30,000 security personnel deployed in rescue operations. Even with such a large response, a lack of one shared live map made it difficult to coordinate rescue zones, blocked roads, stranded civilians, and available resources across districts.
   A similar challenge appeared during the 2025 anti-corruption protests, where the death toll later reached 72 and injuries exceeded 2,113. In such situations, officers and commanders need to know which areas are escalating, where deployments are already in place, and where support is urgently needed. Without live situational awareness, response becomes reactive instead of proactive.
   Road safety is another example of a repeated operational need. Lumbini Province alone recorded 506 deaths from road accidents in one fiscal year, showing that traffic incidents are not isolated events but a continuing public safety issue. This makes real-time hotspot tracking and resource deployment highly valuable for Nepal Police.
   The central problem is not a lack of effort or manpower. It is the absence of a single, shared, real-time operational picture that supports fast decisions and better coordination.

3. Why This Problem Matters
   We chose this problem because it reflects a real and recurring operational reality in Nepal. Floods, protests, and road incidents are not rare edge cases; they are repeated events that police must handle every year. In each case, officers know what is happening locally, but the challenge is getting that information to everyone else quickly and clearly.
   A hackathon solution should solve a real bottleneck, and this one does exactly that. It helps translate field reports into a live dashboard that command staff can use immediately. That makes the system useful not just as a demo, but as a practical operational tool that could realistically support police coordination.

4. Proposed Solution
   SituationalMap NP is a web dashboard that allows officers to pin incidents on a live map, classify them by category and severity, and update their status as situations evolve. It also lets command staff track personnel, vehicles, and support units, creating a clearer view of available resources during emergencies. Instead of receiving fragmented updates from different channels, police leadership can see the operational picture in one place.
   For example, during floods, field teams can mark blocked roads, rescue locations, stranded families, and available boats on the map. During protests, commanders can see where tensions are increasing, where units are already deployed, and where additional support is required. During road safety operations, officers can identify repeated accident hotspots and plan enforcement or prevention measures more effectively.
   The system also generates concise Nepali situation reports from live incident data. This helps command staff understand the current situation quickly without manually collecting and combining updates from different officers. Because the system is web-based, it can run on both phones and computers without requiring new hardware or complicated installation.

5. Alignment With Nepal Police
   This solution aligns with Nepal Police’s current operational reality because it improves, rather than replaces, the existing way officers report and respond to incidents. The dashboard supports district-level coordination, command communication, and multi-agency response, which are already part of police operations during disasters and public-order incidents. It simply makes those workflows faster, clearer, and more visible.
   It also fits the hackathon track’s emphasis on traffic intelligence, situational awareness, and disaster coordination. The solution addresses exactly what the track highlights: officers running long shifts with no real-time data while road deaths, protests, and disasters stretch the force even thinner. That makes the proposal highly relevant to the competition’s purpose.

6. Objectives
   The main objectives of SituationalMap NP are:
   Improve real-time situational awareness for Nepal Police by giving officers and command staff a shared live view of incidents, resources, and field updates.
   Support faster and better decision-making during disasters, protests, and traffic incidents by replacing delayed phone-based coordination with one centralized dashboard.

7. Real-Life Need
   Floods and landslides
   In the September 2024 floods and landslides, Nepal experienced major loss of life and widespread rescue operations, with more than 17,000 people rescued and over 30,000 security personnel deployed. Situational awareness in that kind of event is difficult when blocked roads, rescue points, and affected zones keep shifting. A shared operational map would help commanders see everything in one place and assign resources more efficiently.
   Protests and crowd control
   During the September 2025 protests, the death toll rose to 72 and injuries exceeded 2,113. In fast-changing public-order situations, commanders need to know where unrest is growing, where units are already deployed, and where escalation is likely next. A live dashboard would make this much easier to manage.
   Road safety
   Lumbini Province’s high road-fatality figures show that traffic incidents are a persistent operational challenge. A live incident and hotspot dashboard would help police identify patterns, strengthen prevention, and improve deployment decisions. This makes the system useful not only in emergencies but also in everyday policing.

september 2025
genz protest
in september 2025, with low understanding of the crowds and unclear map overview of the location, it has lead to killed and injured of more than 50 people. A live incident and hotspot dahaboerd it will be clear for police to identify the patterns and strenthen prevention and improve deployment decisions.

8. Key Features
   Live incident reporting with category, severity, and location.
   Real-time dashboard updates for all connected users.
   Simple access control for field officers and command users.
   These features are intentionally focused on the core operational need. They avoid unnecessary complexity and keep the product practical for a hackathon build.

9. Technology Stack
   Frontend: TanStack Start
   Backend:in tanstack start (express)
   Database: PostgreSQL with PostGIS
   Real-time updates: Server-Sent Events (SSE)
   Report generation: LLM-based Nepali summary
   Deployment: Web-based, accessible through browser on phone or desktop
   This stack is suitable because it is modern, lightweight, and fast to prototype. It also supports map-based data and real-time updates, which are essential for the solution.

10. Expected Impact
    SituationalMap NP can create several practical benefits for Nepal Police:
    Faster emergency response through shared visibility.
    Better coordination between districts and agencies.
    Reduced dependence on phone calls and manual updates.
    More effective use of limited police resources.
    Clearer command-level decision-making during crises.
    A foundation for future police operations tools.
    The impact is not only technological but operational. It improves how decisions are made during situations where time and clarity matter most.

11. Future Scope
    After the hackathon, the system can be expanded with offline sync, SMS alerts for low-connectivity areas, analytics for incident trends, and integration with additional police systems. It can also be extended for victim follow-up, missing person management, and broader public safety services. This gives the project a strong long-term roadmap while keeping the hackathon version simple and achievable.

12. Conclusion
    SituationalMap NP is a practical and scalable solution for Nepal Police’s real-time coordination needs. It responds directly to the kinds of events Nepal has already faced — floods, protests, and road crashes — where delayed coordination can increase risk and worsen outcomes. By turning scattered field reports into one live operational view, the system can improve response speed, coordination quality, and command decision-making.
