# RESEARCH-002 — WORK MODEL & TEAM INTELLIGENCE

## How Restaurant OS Understands Work, Teams, and the Human Side of Operations

---

## PREAMBLE

Restaurant OS already defines:

- What a business is (Business Operating Model)
- How an owner decides (Research-001 — Owner Decision Model)
- How the platform learns (Business Intelligence Fabric)
- What the platform believes (Constitution)
- How the platform makes product decisions (Product Principles)
- How the owner should feel (Signature Experience)

This document defines the missing layer:

**How Restaurant OS understands work itself.**

Not people. Not payroll. Not HR.

Work.

Every restaurant runs on the decisions made by every person in the building — not just the owner. A cashier deciding how to handle an unhappy customer. A line cook deciding whether to call out a mistake on a ticket. A dishwasher deciding which rack to run first. A manager deciding whether to send someone home early.

These are not small decisions. They are the restaurant.

Restaurant OS cannot fulfill its mission if it only serves the owner. The platform must eventually understand the entire organization — not to monitor it, but to support it.

This document does not define features.

It does not define screens.

It defines a model of work that every future team feature must respect.

---

## HOW TO READ THIS DOCUMENT

This is research, not philosophy.

Each section is grounded in observed patterns of restaurant operations, synthesized from:

- Restaurant industry operations literature
- Published accounts of kitchen and service workflows
- Hospitality management research
- Service design and operations management frameworks
- Direct observation of restaurant team dynamics

No section contains implementation specifications. No section contains visual or architectural plans.

This document is the permanent operational foundation for every feature that helps a team member perform better.

---

# PART I — THE TEAM MODEL

---

## SECTION 1 — Why Team Intelligence Exists

Restaurant OS understands businesses. It understands owners.

But a restaurant is not run by one person. It is run by a team — a group of humans with different roles, different information needs, different stress profiles, and different decision-making authority.

The team is not a single entity. It is a network of roles, each with its own mission, rhythm, and cognitive load.

Most restaurant technology treats employees as resources — labor hours that must be optimized, bodies that must be scheduled, costs that must be controlled. This is the surveillance approach. It is built on distrust.

Restaurant OS must take a fundamentally different approach.

The goal is not to monitor employees. The goal is to make every employee better at their job by reducing the uncertainty they face, providing the information they need when they need it, and removing the friction that prevents them from doing their best work.

A cashier who has the information to handle a customer problem confidently is a better cashier.

A line cook who knows the prep status of every station before the rush hits is a better cook.

A manager who can see the team's current state without walking the entire floor is a better manager.

None of this requires surveillance.

It requires understanding work.

---

## SECTION 2 — The Fundamental Principle

**A Restaurant OS team feature is never about the employer.**

It is always about the employee.

Every feature must answer one question:

> **"Does this genuinely help this employee perform better today?"**

If the answer is no, the feature does not belong in Restaurant OS.

If the answer is yes, but the feature could also be used to monitor, judge, or punish, the feature must be redesigned until it cannot.

This principle is inviolable. It is the filter for every team decision.

---

## SECTION 3 — Role Categories

The roles detailed below represent the major work functions in a typical restaurant. Not every restaurant has every role. Some restaurants combine roles. The model is designed to be composable — a restaurant defines which roles exist and how they relate.

The roles are grouped by functional area:

| Area | Roles |
| :--- | :--- |
| **Leadership** | Owner, General Manager, Assistant Manager, Shift Leader |
| **Front of House** | Server, Host, Cashier, Bartender, Barista |
| **Back of House** | Head Chef, Line Cook, Prep Cook, Dishwasher |
| **Support** | Delivery Driver, Inventory Clerk, Cleaning Staff |

---

# PART II — ROLE ANALYSIS

---

## ROLE 1 — General Manager

**Mission:** Ensure the restaurant runs profitably and consistently across every shift, every day.

**Daily Objectives:**
- Confirm staffing is adequate for each shift
- Verify opening procedures completed correctly
- Monitor service quality during peak hours
- Handle escalated customer issues
- Conduct end-of-day reconciliation
- Prepare for next day's operations

**Typical Decisions:**
- Who works which station today
- Whether to send someone home early
- How to handle a customer complaint
- Whether to 86 a menu item
- Whether to call in a backup
- Which supplier issue to prioritize

**Information Required:**
- Today's reservations and expected covers
- Current staffing vs. optimal staffing
- Station assignment and who is trained where
- Prep status for each station
- Any incidents from previous shift
- Labor percentage so far today

**Common Frustrations:**
- Not knowing where gaps will appear until they appear
- Spending the first 30 minutes of every shift chasing information
- Interruptions from every direction during service
- Being held responsible for things they cannot control (supplier delays, equipment failure)
- Shift notes from the previous manager that are incomplete or missing
- No time for strategic work because operational fires consume the day

**Interruptions:**
- Staff questions about every small decision
- Customer complaints escalated from servers
- Phone calls from suppliers
- Equipment failures
- Delivery driver questions
- Owner checking in

**Stress Points:**
- The gap between what they know and what they need to know during service
- Balancing labor cost against service quality in real time
- Being the only person who can make certain decisions during a shift
- Handoff between shifts — information lost, assumptions made
- Never having a complete picture until after the rush is over

**Dependencies:**
- Shift leaders execute the manager's decisions
- Kitchen provides accurate prep status
- Host provides accurate arrival forecasts
- Previous manager provides accurate shift notes
- Owner provides clear boundaries on authority

**Success Signals:**
- Shifts run without escalation to owner
- Labor targets met without service degradation
- Shift handoffs are complete and accurate
- Staff feels supported and informed
- Operational problems are anticipated, not reacted to

**Failure Signals:**
- Frequent escalations to owner during service
- Consistent labor overruns
- Staff does not know what is happening
- Same operational problems recur shift after shift
- Manager spends more time firefighting than planning

**Where Restaurant OS Can Help:**
- Provide a real-time operational dashboard that shows staffing, prep status, reservations, and incidents at a glance
- Automate shift handoff documentation — record what happened, what needs attention, what changed
- Surface anomalies before they become problems (low prep, late supplier, unexpected reservation surge)
- Give the manager a single place to confirm "is my shift ready?" before service starts
- Never make the manager feel watched — make them feel prepared

---

## ROLE 2 — Shift Leader

**Mission:** Execute the shift plan — keep service running smoothly, handle routine decisions, and escalate only what the manager genuinely needs.

**Daily Objectives:**
- Assign stations for the shift
- Verify all stations are set up and ready
- Monitor ticket times and service flow
- Handle routine customer and staff issues
- Coordinate handoff to next shift leader
- Report shift summary to manager

**Typical Decisions:**
- Who covers which section
- Whether to call for a runner during rush
- Whether to comp a small item for a dissatisfied customer
- When to start break rotation
- How to adjust station assignments mid-shift if someone is struggling

**Information Required:**
- Who is working this shift
- Who is trained on each station
- Current ticket times and service pace
- Any VIPs or special reservations
- Prep status for each station
- Par levels for high-volume items

**Common Frustrations:**
- Not having authority to make decisions that would help the shift run better
- Receiving incomplete information from the previous shift
- Being blamed for problems that started before their shift
- Staff not showing up or arriving late
- Having to track down information across multiple tools (or people)

**Interruptions:**
- Staff questions about procedures
- Customer complaints
- Manager direction (often contradictory)
- Kitchen callouts for 86'd items
- Phone calls for the manager

**Stress Points:**
- Responsibility without full authority
- Making decisions during rush with incomplete information
- Balancing service quality with speed
- Managing staff personalities under pressure
- The gap between what the manager expects and what the team can deliver

**Dependencies:**
- Previous shift leader provides accurate handoff
- Kitchen provides accurate prep and timing
- Manager provides clear decision boundaries
- Staff shows up on time and ready

**Success Signals:**
- Shift runs without major incidents
- Ticket times stay within targets
- Staff feels supported and clear on priorities
- Handoff to next shift is complete
- Manager receives a useful shift summary

**Failure Signals:**
- Shift ends with unresolved issues
- Staff conflicts escalate to manager
- Handoff is rushed or incomplete
- Service quality declined during the shift
- Manager has to step in repeatedly

**Where Restaurant OS Can Help:**
- Provide a clear shift start summary — who is here, what is ready, what needs attention
- Surface real-time service metrics (ticket times, order volume) without requiring the leader to ask
- Simplify shift handoff — structured notes, unresolved items, recommendations for next shift
- Give the leader a simple way to escalate without losing context
- Never create a tool that makes the leader feel accountable to the algorithm

---

## ROLE 3 — Cashier

**Mission:** Process transactions accurately and quickly while creating a positive last impression of the restaurant.

**Daily Objectives:**
- Process all transactions during assigned shift
- Maintain accurate cash drawer
- Handle payment issues gracefully
- Answer customer questions about menu, promotions, and policies
- Support takeout and delivery order handoff

**Typical Decisions:**
- How to handle a payment that declines
- Whether to call a manager for a price dispute
- How to handle a customer who says their order is wrong
- When to ask for help during a rush
- Which carryout order to prioritize

**Information Required:**
- Current menu with prices and modifiers
- Today's specials and promotions
- Current wait time for food
- Which items are 86'd
- Delivery platform order status
- Manager on duty (who to call for help)

**Common Frustrations:**
- Customers who do not know what they want
- Menu questions the cashier cannot answer (allergens, ingredients, prep methods)
- Payment system slowness during rush
- 86'd items that were not communicated until the customer orders them
- Delivery driver issues that slow the line
- Being the single point of contact for every customer problem

**Interruptions:**
- Phone calls while serving customers
- Delivery drivers asking about orders
- Kitchen calling about 86'd items
- Manager calling for updates
- Customer questions at the register while on the phone

**Stress Points:**
- Long lines with impatient customers
- System errors during payment processing
- Customers who are angry about wait times or order accuracy
- Making change and balancing the drawer under time pressure
- Being the last person the customer interacts with — all frustrations land here

**Dependencies:**
- Kitchen provides accurate ticket times
- Manager communicates 86'd items before customers order
- Delivery platform syncs orders correctly
- System provides fast, reliable payment processing

**Success Signals:**
- Accurate drawer at end of shift
- Customers leave happy even when there were problems
- Line moves consistently without building
- Few escalations to manager
- Delivery orders are correctly handed off

**Failure Signals:**
- Drawer is off at end of shift
- Customers leave frustrated
- Line backs up during rush
- Frequent manager calls for routine issues
- Delivery orders lost or given to wrong driver

**Where Restaurant OS Can Help:**
- Provide real-time 86'd item list so the cashier knows before the customer orders
- Surface current ticket times for accurate promise to customers
- Give quick access to menu information (allergens, ingredients, modifiers)
- Simplify payment issue resolution with clear step-by-step guidance
- Never track speed-of-service metrics that could be used against the cashier

---

## ROLE 4 — Server

**Mission:** Create a memorable dining experience for every table through attentive, knowledgeable, and timely service.

**Daily Objectives:**
- Set up and maintain section
- Greet tables promptly
- Take accurate orders
- Deliver food and drinks on time
- Check on tables throughout the meal
- Process payments
- Reset tables between parties

**Typical Decisions:**
- How to prioritize tables during a rush
- How to handle a food quality complaint
- Whether to offer a free item to a dissatisfied customer
- How to adjust service style for different table types (business, family, date)
- When to ask for help from runners or bussers

**Information Required:**
- Table assignments and rotation
- Today's specials and 86'd items
- Allergen information for every menu item
- Prep times for each dish
- Current kitchen ticket times
- VIP or special occasion tables

**Common Frustrations:**
- Kitchen ticket times that are longer than promised to the customer
- 86'd items discovered after the customer orders
- Menu questions they cannot answer confidently
- Sections that are too large to serve well
- Support staff (runners, bussers) who are unavailable when needed
- Customers who blame the server for kitchen delays

**Interruptions:**
- New tables seated while current tables need attention
- Kitchen callouts for pickups
- Manager direction during service
- Other servers asking for help
- Customer questions while carrying multiple plates

**Stress Points:**
- Multiple tables needing attention simultaneously
- Customers becoming angry about wait times
- Forgetting to enter or deliver something
- Running out of hands during peak service
- Being caught between customer expectations and kitchen reality

**Dependencies:**
- Kitchen provides accurate and timely food
- Host provides balanced seating
- Runners and bussers provide timely support
- Manager provides backup for difficult situations
- Cashier handles payments efficiently

**Success Signals:**
- Tables report positive experience
- Tips reflect quality of service
- Sections turn efficiently
- Few complaints or comps
- Team feels cooperative, not competitive

**Failure Signals:**
- Tables waiting too long for service
- Orders entered incorrectly
- High comp rate for service issues
- Negative reviews mentioning specific server
- Team conflict over sections or tips

**Where Restaurant OS Can Help:**
- Provide real-time ticket tracking so the server knows when food is ready
- Surface table status and timing for better prioritization
- Give instant access to menu and allergen information
- Alert when a table has been waiting too long for a check-in
- Never use table timing data to penalize the server

---

## ROLE 5 — Host

**Mission:** Control the flow of the dining room — seat guests efficiently, manage wait times, and set the tone for the entire experience.

**Daily Objectives:**
- Manage reservation book
- Seat walk-in guests
- Communicate wait times accurately
- Balance server sections
- Handle phone calls and to-go orders
- Coordinate with servers on table readiness

**Typical Decisions:**
- Which table to assign to which party
- How to handle a reservation when the table is not ready
- Whether to seat a large party when the kitchen is backed up
- How to manage a waitlist during a rush
- How to handle VIPs and regulars

**Information Required:**
- Current reservation status
- Server section assignments and current load
- Table turn times (actual, not estimated)
- Current kitchen ticket times
- VIP or regular customer preferences
- Special requests (high chairs, allergies, accessibility)

**Common Frustrations:**
- Servers who are not ready for new tables (dirty sections, ignoring seatings)
- Kitchen delays that force longer wait times than expected
- Reservations that do not show up (wasted tables)
- Walk-in rushes that overwhelm the reservation plan
- Communication breakdowns with the kitchen about timing
- Angry customers about wait times the host cannot control

**Interruptions:**
- Phone calls while managing the door
- Customers arriving without reservations during a full house
- Servers complaining about section balance
- Manager direction mid-service
- Kitchen calls about prep delays

**Stress Points:**
- Angry customers about wait times
- Balancing fairness (first come, first served) with business priorities (VIPs, large parties)
- Making seating decisions that affect server income (tip disparity)
- Being the first point of contact and the first point of blame
- Managing a crowded waiting area

**Dependencies:**
- Servers provide clean tables promptly
- Kitchen provides accurate ticket time estimates
- Manager provides clear VIP and seating policies
- Reservation system is accurate and up to date

**Success Signals:**
- Wait times are accurate (customers are seated when promised)
- Sections are balanced (servers have equal opportunity)
- Customers are seated without confusion or conflict
- VIPs and regulars are recognized and accommodated
- Phone calls are handled without disrupting the door

**Failure Signals:**
- Customers wait longer than quoted
- Servers are overwhelmed or underutilized
- VIPs or regulars are not recognized
- Seating conflicts or double-bookings
- Host leaves shift stressed and overwhelmed

**Where Restaurant OS Can Help:**
- Provide real-time view of table status, server load, and kitchen timing
- Surface accurate wait time estimates based on actual turn times, not guesses
- Flag VIPs and regulars before they arrive
- Give the host clear seating recommendations without removing their judgment
- Never use seating efficiency metrics to pressure the host

---

## ROLE 6 — Line Cook

**Mission:** Execute every ticket accurately and consistently — plate after plate, rush after rush — without compromising quality.

**Daily Objectives:**
- Set up station before service
- Prep mise en place for expected volume
- Execute tickets in order during service
- Maintain station cleanliness and organization
- Communicate with expo and other stations
- Break down and clean station after service

**Typical Decisions:**
- How to prioritize tickets during a rush
- When to call for backup from another station
- Whether to send out a plate that is slightly below standard
- How to adjust cook times for different levels of doneness
- How to handle a ticket with a mistake

**Information Required:**
- Current ticket queue (what is coming, what is in progress)
- Prep levels for each ingredient
- Special requests and modifications on current tickets
- Par levels for high-volume items
- Which items are 86'd
- Timing expectations (fire times for different items)

**Common Frustrations:**
- Tickets that pile up faster than they can execute
- Modifications that break the cooking flow
- Running out of prepped items during a rush
- Equipment that is not working or not calibrated
- Poor communication from expo or front of house
- Tickets with errors that could have been caught earlier

**Interruptions:**
- Expo calling for items that are late
- Other stations asking for help
- Manager checking on ticket times
- Prep calls from the front (86'd items)
- Equipment failures or alerts

**Stress Points:**
- Ticket times that exceed expectations
- Running out of a critical ingredient mid-rush
- Mistakes on tickets that require re-fire
- Heat, noise, and physical demands of the line
- The knowledge that every plate represents the restaurant's reputation
- Being blamed for delays caused by other stations

**Dependencies:**
- Prep cook provides sufficient mise en place
- Expo provides clear, organized ticket flow
- Dishwasher provides clean equipment and tools
- Other stations provide timely handoffs
- Manager provides accurate volume forecasts

**Success Signals:**
- All tickets fired and sent within target time
- Plates returned to the pass (few re-fires)
- Station is organized and clean throughout service
- Team communication is smooth and professional
- Cook finishes shift without feeling they let anyone down

**Failure Signals:**
- Ticket times exceed targets consistently
- High re-fire rate
- Station runs out of prepped items
- Communication breakdowns between stations
- Cook leaves shift exhausted and frustrated

**Where Restaurant OS Can Help:**
- Provide a clear, calm ticket display that shows priority and timing
- Surface prep level alerts before items run out
- Give the cook a single source of truth for modifications and special requests
- Never track individual cook speed — track ticket flow and surface bottlenecks without blame
- Alert when a station is falling behind so the team can rebalance before it becomes a crisis

---

## ROLE 7 — Prep Cook

**Mission:** Have the right ingredients, in the right quantity, prepared to the right standard, before the line needs them.

**Daily Objectives:**
- Review prep list for the day
- Execute prep according to specifications
- Label, date, and store all prepared items
- Track usage and communicate shortages
- Maintain prep area cleanliness and organization
- Set up the next shift's prep when applicable

**Typical Decisions:**
- Which prep tasks to prioritize when time is tight
- How to adjust prep quantities based on usage patterns
- Whether to flag an ingredient that does not meet spec
- When to communicate a potential shortage
- How to handle unexpected volume changes

**Information Required:**
- Prep list with quantities by item
- Historical usage patterns (what sells on which days)
- Current inventory levels for key ingredients
- Upcoming events or specials that will affect demand
- Spec sheets for each preparation (cut size, recipe, yield)
- Par levels for each station

**Common Frustrations:**
- Prep list quantities that do not match actual usage
- Running out of a key ingredient during prep
- Equipment that is not working or shared with line
- Receiving deliveries that are incorrect or late
- Being blamed for shortages caused by inaccurate forecasts
- Repetitive physical work with no feedback on quality or impact

**Interruptions:**
- Line calling for additional prep during service
- Delivery drivers arriving during prep time
- Manager changing prep priorities mid-shift
- Equipment breakdowns
- Health inspector or quality checks

**Stress Points:**
- Not having enough time to complete the prep list
- Physical demands of standing, lifting, and repetitive motion
- Responsibility for food safety without always having the tools
- Being out of sync with the line's needs
- Working alone for long stretches

**Dependencies:**
- Suppliers deliver the right ingredients on time
- Line communicates accurate usage and shortages
- Manager provides accurate prep lists
- Previous prep cook left the station organized
- Equipment is functional and clean

**Success Signals:**
- All prep completed before line needs it
- No shortages during service traceable to prep
- Station is clean, organized, and properly labeled
- Prep quantities match actual usage (minimal waste)
- Next shift finds the station ready

**Failure Signals:**
- Line runs out of prepped items during service
- Prep not completed before rush
- Items not labeled or dated correctly
- High prep waste (overproduced items spoil)
- Station is disorganized at shift end

**Where Restaurant OS Can Help:**
- Provide prep lists calibrated to historical usage patterns, not guesses
- Surface inventory levels before prep starts so shortages are known early
- Give the prep cook visibility into how their work affects service
- Never track individual prep speed — track whether the line had what it needed
- Acknowledge the prep cook's contribution to service quality

---

## ROLE 8 — Dishwasher

**Mission:** Provide clean equipment, tools, and serveware to every station — continuously, silently, and without becoming a bottleneck.

**Daily Objectives:**
- Set up dish pit before service
- Process soiled items continuously during service
- Maintain clean supply for every station
- Keep dish pit organized and safe
- Deep clean kitchen after service
- Maintain dish machine and report issues

**Typical Decisions:**
- How to prioritize dishes during a rush (plates vs. pans vs. utensils)
- When to call for help catching up
- How to handle a broken item
- When to stop and clean the machine
- How to organize the pit for maximum flow

**Information Required:**
- Current volume of soiled items
- Which stations are running low on clean items
- Machine status (temp, cycle time, chemical levels)
- End-of-shift cleaning requirements
- Safety procedures for the dish pit

**Common Frustrations:**
- Being treated as invisible by the rest of the team
- Stations that do not scrape or pre-rinse their dishes
- Running out of clean plates during a rush
- Dish machine breaking down with no backup plan
- Physical demands with no recognition
- Being blamed for supply shortages caused by under-scraping

**Interruptions:**
- Stations calling for specific clean items urgently
- Machine breakdowns
- Manager asking for status
- Delivery drivers needing clean containers
- Kitchen emergencies that require immediate clean items

**Stress Points:**
- Falling behind and watching the pile grow
- Physical strain from repetitive motion and heat
- Working in isolation with no feedback
- Being the bottleneck that slows the entire restaurant
- Slippery floors, hot water, sharp objects — safety risks

**Dependencies:**
- Stations scrape and pre-rinse before sending dishes
- Machine is maintained and functional
- Manager provides adequate staffing for volume
- Team communicates urgent needs clearly

**Success Signals:**
- Every station has what it needs when it needs it
- Dish pit is organized and safe
- Machine is maintained and running
- No service delays caused by dish shortage
- Pit is clean and ready at shift end

**Failure Signals:**
- Stations run out of clean items during service
- Dish pit is chaotic and unsafe
- Machine breaks down and no one knows
- Dishes pile up faster than they can be processed
- Dishwasher leaves shift feeling invisible and unappreciated

**Where Restaurant OS Can Help:**
- Provide a simple signal when any station is running low on a specific item
- Surface machine status and maintenance schedule
- Give the dishwasher a way to communicate "I need help" without having to chase someone down
- Never track dishwashing speed — track whether the restaurant had the clean items it needed
- Recognize the dishwasher's role explicitly — they enable every other role to do their job

---

## ROLE 9 — Delivery Driver

**Mission:** Get every order to the customer hot, accurate, and on time — representing the restaurant at the customer's doorstep.

**Daily Objectives:**
- Verify delivery orders for accuracy and completeness
- Pack orders for transport (hot/cold separation, stability)
- Navigate to delivery addresses efficiently
- Hand off orders professionally
- Return to restaurant for next delivery
- Report delivery issues back to the restaurant

**Typical Decisions:**
- Which route to take for multiple deliveries
- How to handle a customer who is not at the door
- Whether to wait for a late customer or leave the order
- How to handle an incorrect address
- When to contact the restaurant for help

**Information Required:**
- Delivery address and special instructions
- Order contents (for verification)
- Customer contact information
- Best route for multi-delivery runs
- Estimated delivery time promised to customer
- Current traffic and weather conditions

**Common Frustrations:**
- Orders not ready when they arrive at the restaurant
- Incorrect addresses or hard-to-find locations
- Customers who do not answer the door or phone
- Apartment buildings with no elevator or access codes
- Traffic that makes promised delivery times impossible
- Being blamed for delays caused by the kitchen

**Interruptions:**
- New delivery assignments while en route
- Customer calls about their order
- Restaurant calling about a cancelled or changed order
- Traffic incidents
- Weather changes

**Stress Points:**
- Pressure to deliver on time despite external factors
- Navigating unfamiliar areas under time pressure
- Car maintenance and fuel costs (if using personal vehicle)
- Safety concerns (night deliveries, bad neighborhoods)
- Being alone with no support during issues

**Dependencies:**
- Kitchen completes orders on time
- Packing team organizes orders correctly
- Navigation system provides accurate routes
- Customers provide accurate addresses and contact info
- Weather and traffic are manageable

**Success Signals:**
- All orders delivered within promised time
- No missing or incorrect items reported
- Customer interacts positively at delivery
- Efficient route management (multiple orders per run)
- Driver feels they represented the restaurant well

**Failure Signals:**
- Late deliveries
- Wrong items delivered
- Customer complaints about driver attitude
- Multiple delivery issues per shift
- Driver disconnects or quits mid-shift

**Where Restaurant OS Can Help:**
- Provide accurate order-ready times so the driver arrives when the order is ready, not before
- Surface optimized routes for multi-delivery runs
- Give the driver a simple way to report delivery issues
- Never track driver speed against unrealistic targets
- Give the driver visibility into what is waiting for them at the restaurant

---

## ROLE 10 — Bartender

**Mission:** Produce drinks efficiently and accurately while providing a service experience at the bar.

**Daily Objectives:**
- Set up bar before service
- Prepare garnishes, juices, and syrups
- Serve bar customers
- Process service tickets from servers
- Manage pour costs and inventory
- Clean and close bar after service

**Typical Decisions:**
- How to prioritize bar customers vs. service tickets
- How to handle an intoxicated customer
- How to substitute a cocktail ingredient when out of stock
- When to cut someone off
- How to handle payment issues

**Information Required:**
- Current drink menu and specials
- Recipe specs for every cocktail
- Current inventory of spirits, mixers, garnishes
- Service ticket queue
- Bar customer count and turnover
- VIP or regular preferences

**Common Frustrations:**
- Service tickets piling up while bar customers need attention
- Running out of a key ingredient mid-service
- Glassware that is not clean or not available
- Servers who do not enter tickets correctly
- Customers who do not know what they want
- Being treated as a separate business from the restaurant

**Interruptions:**
- Service tickets printing during bar service
- Manager calling about inventory or pour cost
- Server questions about drink specs
- Customer complaints about other customers
- Equipment issues (ice machine, blender, taps)

**Stress Points:**
- Balancing bar customers against service tickets
- Cocktail quality under time pressure
- Managing intoxicated customers
- Pour cost accountability vs. guest satisfaction
- Late-night incidents

**Dependencies:**
- Dishwasher provides clean glassware
- Server enters tickets correctly
- Manager provides clear policies on comps and over-serving
- Inventory is ordered and delivered on time
- Ice machine and equipment are functional

**Success Signals:**
- Drinks are accurate and consistently high quality
- Bar customers feel attended to
- Service tickets are processed without significant delay
- Pour cost is within target
- Bar closes clean and organized

**Failure Signals:**
- Bar customers feel ignored
- Service tickets back up
- Drink quality is inconsistent
- Pour cost exceeds target
- Incidents with intoxicated customers

**Where Restaurant OS Can Help:**
- Provide a clear service ticket queue with timing so the bartender can plan their flow
- Surface inventory levels before they run out
- Give quick access to recipe specs
- Never track individual drink speed — track wait times and quality
- Alert when pour cost trends change

---

## ROLE 11 — Inventory Clerk

**Mission:** Ensure the restaurant has the right ingredients and supplies, in the right quantities, at the right time, at the right cost.

**Daily Objectives:**
- Receive and verify deliveries
- Update inventory records
- Flag discrepancies between received and ordered items
- Monitor par levels and usage patterns
- Communicate shortages to management
- Rotate stock (FIFO)

**Typical Decisions:**
- Whether to accept a delivery with minor issues
- How to handle a short delivery
- Which supplier to call for a rush order
- How to organize storage for maximum efficiency
- When to flag a quality issue with a supplier

**Information Required:**
- Current inventory levels for all items
- Par levels and reorder points
- Supplier lead times and delivery schedules
- Upcoming volume forecasts (reservations, events, weather)
- Historical usage patterns (seasonal, day-of-week)

**Common Frustrations:**
- Deliveries that arrive late or incomplete
- Suppliers who do not communicate substitutions or shortages
- Kitchen that does not follow FIFO
- Space constraints in storage
- Being blamed for shortages caused by inaccurate forecasts
- Physical demands of receiving and organizing

**Interruptions:**
- Delivery arrivals during busy times
- Chef calling for a status check on a key ingredient
- Manager asking about order status
- Supplier calls about substitutions or delays
- Kitchen emergencies requiring immediate supplies

**Stress Points:**
- Running out of a critical item that stops service
- Accepting a delivery that may have quality issues
- Managing multiple suppliers with different schedules
- Being the person responsible when something is missing
- Physical demands of lifting and organizing

**Dependencies:**
- Suppliers deliver accurately and on time
- Kitchen follows FIFO and reports usage anomalies
- Manager provides accurate forecasts
- Previous clerk left accurate records
- Storage is organized and accessible

**Success Signals:**
- No stockouts during service
- Inventory records match physical counts
- Deliveries are verified and stored correctly
- Waste is minimal (FIFO followed, spoilage tracked)
- Next shift finds organized storage with clear labels

**Failure Signals:**
- Stockouts during service
- Inventory records do not match physical counts
- Receiving errors go undetected
- Spoilage from poor rotation
- Storage is disorganized

**Where Restaurant OS Can Help:**
- Provide par level forecasts based on actual usage, not manual estimates
- Surface delivery schedules and expected quantities
- Simplify receiving with checklists and discrepancy reporting
- Never track individual clerk speed — track inventory accuracy and stockout prevention
- Alert when a reorder point is approaching

---

## ROLE 12 — Cleaning Staff

**Mission:** Maintain a clean, safe, and presentable environment for customers and staff — before, during, and after service.

**Daily Objectives:**
- Pre-service cleaning (dining room, restrooms, entry)
- Continuous cleaning during service (bathrooms, spills, trash)
- Post-service deep cleaning (kitchen, floors, equipment)
- Restock supplies (soap, paper towels, trash bags)
- Report maintenance issues

**Typical Decisions:**
- How to prioritize cleaning tasks during service
- When to stop and restock a bathroom
- How to handle a hazardous spill
- Whether to flag a recurring cleanliness issue
- What to escalate vs. handle independently

**Information Required:**
- Cleaning schedule and checklist
- Safety procedures for chemicals and equipment
- Current priority areas (high-traffic bathrooms, visible spills)
- Supply levels (soap, paper towels, chemicals)
- Previous shift notes about problem areas

**Common Frustrations:**
- Cleaning the same bathroom three times during a rush
- Customers who do not clean up after themselves
- Staff who leave messes in the back
- Running out of supplies during service
- Being invisible — work is only noticed when something is wrong
- Low pay and no recognition despite essential role

**Interruptions:**
- Spills that need immediate attention
- Bathroom calls during service
- Manager direction to reprioritize
- Staff asking for specific area attention
- Equipment that needs cleaning before it can be used

**Stress Points:**
- Physical demands of cleaning all shift
- Being responsible for health inspection readiness
- Working around customers and staff
- Being blamed for issues caused by others
- Feeling invisible and unappreciated

**Dependencies:**
- Staff and customers do not leave excessive mess
- Supplies are ordered and stocked
- Equipment (vacuum, floor scrubber) is functional
- Manager provides clear priorities
- Security handles unsafe situations

**Success Signals:**
- Restrooms are clean and stocked throughout service
- Dining room is clean and presentable at all times
- Cleaning schedule is completed
- Health inspection passes without cleanliness violations
- No safety incidents from wet floors or spills

**Failure Signals:**
- Restrooms become unsanitary during service
- Trash overflows
- Dining room is visibly dirty
- Cleaning schedule is incomplete at shift end
- Health inspection fails

**Where Restaurant OS Can Help:**
- Provide a clear cleaning checklist with priorities for the shift
- Surface supply levels before they run out
- Give the cleaner a way to report maintenance issues without tracking down a manager
- Never track individual cleaning speed — track whether standards were maintained
- Recognize the cleaning role's contribution to the guest experience

---

# PART III — WORK RHYTHM

---

## SECTION 4 — How Every Role Experiences the Day

The restaurant day is not uniform. It has a rhythm that every role experiences differently. Understanding this rhythm is essential for designing team features that arrive at the right time.

### Opening

**Manager/Shift Leader:** The most critical period. Confirm staffing, check prep, review reservations, set the day's priorities. The manager needs information before anyone else can start.

**Server/Host:** Arrive to a clean, set dining room. Review sections. Check reservation book. The host is the first face guests see.

**Line Cook/Prep Cook:** This is the most productive time. Mise en place, stock stations, calibrate equipment. No interruptions yet.

**Cashier:** Verify drawer, review promotions, check 86'd list. Quiet preparation.

**Dishwasher:** The calm before the storm. Clean equipment from the previous night. Ensure every station has clean tools.

**Delivery Driver:** Typically not yet working unless lunch delivery is heavy.

**Cleaning Staff:** Final pass on dining room and restrooms before doors open.

**How Restaurant OS Should Adapt:**
- Opening is the most information-dense period. Everyone needs their shift briefing simultaneously.
- The platform should deliver role-specific briefings, not a single view for all.
- The manager should be able to confirm "everything is ready" without walking every station.

### Rush Hour

**Manager/Shift Leader:** Firefighting mode. Most decisions are reactive. The manager is pulled between stations. Information must be glanceable — no reading, no analysis.

**Server:** Maximum stress. Every table is turning. Sections are full. Every second counts.

**Host:** Managing the door. Waitlist growing. Every table assignment matters.

**Line Cook:** The line is hot. Tickets are printing non-stop. Tunnel vision — the only thing that exists is the next ticket.

**Cashier:** Line at the register. Phone ringing. Delivery drivers waiting.

**Dishwasher:** The pile grows. Every station needs clean items. The dishwasher is the bottleneck that nobody thinks about until plates run out.

**Delivery Driver:** Multiple orders. Traffic. The clock is running on every delivery.

**Bartender:** Bar is full and service tickets are printing. Split focus between guests and tickets.

**Cleaning Staff:** Reactive only. Spills, restrooms, trash. Preventive cleaning stops.

**How Restaurant OS Should Adapt:**
- During rush, the platform should be almost invisible. No notifications. No recommendations.
- If the platform must interrupt, it must be for a genuine emergency — and the message must be readable in under 3 seconds.
- The most valuable thing during rush is silence.

### Quiet Hours

**Manager/Shift Leader:** Recovery time. Review performance. Plan for next service. Handle administrative work.

**Server:** Side work. Restock. Prep for next service.

**Line Cook:** Partial clean. Restock station. Prepare for next service or break.

**Prep Cook:** Additional prep if needed. Organize storage.

**Dishwasher:** Catch up on the pile. Recover.

**Delivery Driver:** Slower period. Wait for next order.

**Bartender:** Clean and restock bar. Prepare for next service.

**How Restaurant OS Should Adapt:**
- Quiet hours are the best time for the platform to communicate. The team has cognitive capacity.
- Shift notes, performance summaries, and next-service prep should arrive here.
- This is when learning happens — what worked, what did not, what to adjust.

### Closing

**Manager/Shift Leader:** End-of-day reconciliation. Cash, reports, next-day prep. Ensure the restaurant is ready for tomorrow.

**Server:** Close out tabs, side work, reset sections. The goal is to leave the section ready for the morning team.

**Host:** Count covers, close reservation book, prepare for next day.

**Line Cook:** Deep clean station. Break down equipment. Report any issues.

**Prep Cook:** Final clean. Document what was prepped for the next shift.

**Dishwasher:** The last person out. Every dish must be clean. Every surface wiped. The machine cleaned.

**Cashier:** Close drawer. Reconcile. Submit.

**Delivery Driver:** Final deliveries. Return equipment.

**Cleaning Staff:** Deep clean. Floors, bathrooms, trash. The restaurant must be ready to open tomorrow.

**How Restaurant OS Should Adapt:**
- Closing is cognitively demanding — the team is exhausted. Information must be minimal.
- Do not ask closing staff to make decisions. Ask them to confirm what happened so the platform can prepare for tomorrow.
- The end-of-shift handoff is the most critical information transfer. Make it structured, fast, and complete.

### Unexpected Incidents

**Manager/Shift Leader:** Everything stops. The incident is the only priority. The manager needs clear, prioritized action steps.

**Server:** If the incident involves their section (customer injury, complaint), they need clear guidance. Otherwise, they should continue service.

**Line Cook:** Kitchen incidents (fire, injury, equipment failure) require immediate action. Otherwise, keep cooking.

**Host/Landing Role:** The host becomes the communication hub — answering questions, clearing the path, redirecting customers.

**Everyone:** Clear communication is the difference between a contained incident and a crisis.

**How Restaurant OS Should Adapt:**
- The platform must have prepared for incidents before they happen (checklists, contact information, procedures).
- During an incident, the platform should present calm, clear, prioritized instructions.
- After an incident, the platform should support the after-action review without blame.
- The platform must never create an incident by alarming the team about a non-critical issue.

---

# PART IV — TEAM INTELLIGENCE

---

## SECTION 5 — What Team Intelligence Means

Team Intelligence is not AI that watches people.

It is the platform's understanding of how work flows through the team — where information needs to be, when it needs to arrive, and who needs it.

Team Intelligence has three components:

1. **Role Awareness.** The platform knows what each role needs to know, when they need it, and what decisions they are making.

2. **Work Flow Awareness.** The platform understands the natural flow of work — opening, prep, service, quiet, closing — and adapts its interaction accordingly.

3. **Coordination Awareness.** The platform understands dependencies between roles and surfaces information that helps one role support another — without creating surveillance.

### What Team Intelligence Does Not Mean

- It does not mean tracking individual performance
- It does not mean measuring employee speed or accuracy
- It does not mean flagging employees who are underperforming
- It does not mean comparing one employee to another
- It does not mean predicting which employees will quit

These are surveillance patterns. They violate the Constitution (Article 25 — Never Manipulates) and the Product Principles (Trust Before Complexity, Reduce Anxiety).

---

## SECTION 6 — Coordination Without Surveillance

The fundamental insight of Team Intelligence is:

> **Most team coordination problems are not people problems. They are information problems.**

A station runs out of prep not because the prep cook is slow, but because the forecast was wrong.

A server cannot answer a customer's question not because they are untrained, but because the 86'd list was not communicated.

A dishwasher falls behind not because they are lazy, but because the line did not scrape their plates.

A manager is stressed not because they cannot handle the role, but because they do not have the information they need before they need it.

When Restaurant OS solves these information problems, it reduces the friction that makes team members look bad, feel bad, and leave.

### How Coordination Works

**Step 1 — Observe dependencies.** The platform knows what each role depends on from other roles.

**Step 2 — Surface information at the dependency point.** When a role needs information from another role, the platform makes that information available — without requiring the recipient to chase it down.

**Step 3 — Never assign blame.** When a dependency fails, the platform does not say "prep cook did not prepare enough." It says "prep levels are low for station 2." The problem is the level, not the person.

**Step 4 — Enable self-correction.** The team member with the information can adjust before the problem escalates. The line cook sees prep levels dropping and communicates before running out.

### Examples

| Dependency | Current Failure | How Restaurant OS Helps |
| :--- | :--- | :--- |
| Line cook needs clean pans from dishwasher | Cook walks to dish pit, finds no clean pans, waits | Dishwasher sees "station 2 requesting pans" on their queue |
| Server needs accurate 86'd list | Server discovers 86 after customer orders | Cashier, server, and host all see a unified 86'd list |
| Manager needs prep status | Manager walks all stations | Manager sees prep completion on their briefing |
| Shift leader needs handoff info | Previous leader scribbles notes on paper | Structured handoff captured and available |

### What Is Never Tracked

- Time spent on a task
- Idle time between tasks
- Individual output volume
- Mistakes per employee
- Speed of task completion
- Rankings or comparisons

---

## SECTION 7 — Team Presence

Restaurant OS should communicate that it knows the team is there — without monitoring them.

**Presence is not surveillance.** Presence is the platform acknowledging the team's existence and supporting their work.

**Examples:**
- "Good morning, [name]. Here is what is ready for your shift."
- "Welcome back from break. Your section is quiet. No new issues."
- "Your shift is ending soon. Here is what to pass to the next team."

**Presence signals:** The platform knows who is working, which role they are in, and what shift they are on. It does not know where they are in the building, how fast they are working, or what they are doing at any moment.

The distinction is fundamental. Presence is supportive. Surveillance is controlling.

---

# PART V — TEAM COMPANION

---

## SECTION 8 — The Employee Application Philosophy

The employee application — the Team Companion — is not a tool for the employer.

It is a tool for the employee.

It exists to answer one question for every team member:

> **"What do I need to know to do my job well today?"**

### How the Employee Must Feel

**Supported.** The platform has their back. It provides the information they need before they need it. It reduces the uncertainty of their workday. It makes them feel prepared.

**Prepared.** Before every shift, the platform tells them what they need to know — what changed, what is different, what to watch for. They arrive informed instead of arriving blind.

**Confident.** When something unexpected happens, the platform gives them clear options. They are never stuck, never guessing, never embarrassed.

**Never watched.** The platform does not track their speed, their accuracy, their mistakes, or their breaks. The platform does not report to management about their individual performance. The platform is on their side.

**Never judged.** The platform does not compare them to other employees. It does not score them. It does not rank them. It does not notify their manager when they are "underperforming."

**Never manipulated.** The platform does not use gamification to drive behavior. It does not create competition. It does not offer badges for working more shifts. It does not use streaks to encourage attendance.

### What the Employee Application Does

- **Shift briefing.** Every shift starts with a simple screen: "Here is what you need to know today. Here is what changed since your last shift."
- **Role-specific information.** The cashier sees 86'd items. The line cook sees prep levels. The server sees table assignments. Each role sees what they need.
- **Communication.** Simple, structured ways to communicate with the team without interrupting everyone. "Station 2 needs pans." Not a text to the manager — a signal that reaches the dishwasher.
- **End-of-shift summary.** What happened, what they contributed, what to pass to the next shift.
- **Learning and growth.** Optional access to training, specs, and resources. Never mandatory. Never tracked.

### What the Employee Application Does Not Do

- Does not display performance metrics
- Does not show rankings or comparisons
- Does not track attendance beyond what the scheduling system already knows
- Does not send alerts about individual behavior to managers
- Does not gamify work
- Does not measure speed or accuracy
- Does not solicit feedback about other employees

---

## SECTION 9 — The Trust Contract

Every employee feature in Restaurant OS must be governed by a Trust Contract — an explicit agreement between the platform and the employee about what data is collected, how it is used, and who can see it.

### Contract Terms

1. **The platform collects only what it needs to help the employee perform better.** It does not collect data that could be used to monitor, evaluate, or rank the employee.

2. **The platform's data is visible to the employee first.** The employee can see everything the platform knows about them. The manager can see only aggregated, anonymized, or role-level data — never individual employee data.

3. **The platform does not report to management about individual employees.** If a problem is systemic (prep levels are consistently wrong), the platform reports the system problem, not the individual who was on prep that day.

4. **The employee can opt out of any non-essential feature.** The core experience (shift briefing, role information) is essential. Everything else is optional.

5. **The platform never shares employee data across restaurants.** If an employee works at multiple locations, their data stays within each location independently.

6. **The platform never uses employee data for any purpose other than helping that employee perform better.** No analytics. No benchmarks. No industry comparisons at the individual level.

---

# PART VI — OPERATIONAL FRICTION

---

## SECTION 10 — Common Operational Problems

The following problems recur in every restaurant. Each represents an opportunity for Restaurant OS to reduce uncertainty and improve team performance.

### Problem 1 — Someone Is Absent

**Impact:** Every absence creates a gap that someone must fill. The manager scrambles to cover. The team is short-staffed. Service quality drops.

**Current response:** Manager calls around, texts people, offers overtime. This consumes the manager's first 30 minutes of the shift.

**How Restaurant OS helps:** Maintain a clear picture of scheduled vs. actual staffing before the shift starts. Surface the gap immediately so the manager can respond. Provide a structured way to request coverage without calling everyone individually. Never track which employees call out most frequently.

### Problem 2 — Inventory Arrives Late

**Impact:** Prep cannot start. Menu items are 86'd. The line is stressed before service begins.

**Current response:** Someone at the restaurant calls the supplier. Waits. Calls again. No one knows where the delivery is.

**How Restaurant OS helps:** Track delivery windows and expected quantities. Surface a delay as soon as it is known, not when someone notices. Provide a structured path to escalate — order from backup supplier, adjust prep list, inform the team.

### Problem 3 — Equipment Fails

**Impact:** A broken fryer, ice machine, or dishwasher stops production. Service is affected until the equipment is fixed.

**Current response:** Someone notices it, tells a manager, manager calls a repair service, waits for a technician. Information is lost between shifts.

**How Restaurant OS helps:** Provide a structured equipment issue report that captures the problem, when it started, and what was tried. Surface recurring issues before they become failures. Maintain the maintenance schedule and technician contact information.

### Problem 4 — Rush Exceeds Forecast

**Impact:** The team is overwhelmed. Ticket times spike. Quality drops. Customers wait. Everyone is stressed.

**Current response:** The manager walks the floor, assesses, and calls for backup or adjusts assignments reactively.

**How Restaurant OS helps:** Compare actual volume against forecast in real time. Surface the variance early — before the team is overwhelmed. Provide clear options: call backup, adjust station assignments, communicate wait times to customers.

### Problem 5 — New Employee Starts

**Impact:** The new employee does not know procedures. They slow everyone down. They require constant supervision. They make mistakes.

**Current response:** The manager assigns a buddy, gives a tour, and hopes for the best. Training quality varies by who is training.

**How Restaurant OS helps:** Provide a structured onboarding path specific to the role. Give the new employee a clear "here is what to learn today" list. Give their buddy a structured "here is what to teach today" list. Never track the new employee's mistakes.

### Problem 6 — Communication Breakdown Between Shifts

**Impact:** The closing shift does not tell the opening shift what happened. Problems recur. Information is lost. The opening team starts blind.

**Current response:** Verbal handoff. Maybe a notebook. Content depends on how tired the closer is.

**How Restaurant OS helps:** Provide a structured shift handoff form. Capture: what happened, what needs attention, what changed, what is coming tomorrow. Make it fast — the closer should complete it in under two minutes. Make it accessible — the opener sees it before they start.

### Problem 7 — Customer Complaint Escalation

**Impact:** A small complaint becomes a big problem because no one had the information or authority to resolve it at the point of contact.

**Current response:** The employee finds a manager. The manager assesses. The resolution depends on the manager's mood and the employee's ability to explain the situation.

**How Restaurant OS helps:** Give every front-line employee clear, role-appropriate resolution guidelines. "If the customer is unhappy with their food and the total is under $X, you can comp the item." Give them the information they need to resolve the issue themselves. Escalate only what genuinely needs escalation.

---

# PART VII — TEAM MEMORY

---

## SECTION 11 — What Restaurant OS Remembers About the Team

Restaurant OS must remember things that help the team perform better. It must forget things that could be used against them.

### What to Remember

**Training.** What training has each team member completed? What are they certified on? What are they working on next? This information helps the manager assign stations and schedule development — it does not evaluate performance.

**Strengths.** What does each team member do well? Who is excellent on the fry station? Who handles difficult customers gracefully? Who keeps the dish pit organized? This is not a ranking — it is a knowledge base for better assignments.

**Preferences.** What shifts does each team member prefer? What stations? What days off? This helps with scheduling that respects the employee's life — it is not a negotiation tool.

**Experience.** How long has each team member been in their role? What previous roles have they held? This helps the platform calibrate information density — a new hire needs more guidance than a veteran.

**Past incidents.** When something went wrong (an accident, a safety issue, a customer incident), the platform remembers what happened and what was learned — but it remembers the incident, not the person. "The walk-in door was left open on Tuesday closing" not "Jose left the walk-in door open."

### What to Forget (or Never Remember)

**Mistakes.** Individual mistakes are not recorded. If a cook fires a steak wrong, that knowledge exists only in that moment. It is not accumulated. It is not reported.

**Speed.** How fast anyone does anything is not tracked. Speed tracking is surveillance, regardless of how it is framed.

**Attendance patterns.** Unless the employee is using the platform to manage their own schedule, attendance data is the scheduling system's responsibility, not the platform's.

**Interpersonal issues.** Personality conflicts, attitude observations, and subjective assessments do not belong in the platform. These are human management issues that data cannot improve.

### Privacy Principles

1. **Data minimization.** Collect only what is needed to help the employee perform better. If a data point cannot be justified by this purpose, it is not collected.

2. **Employee access.** Every team member can see their own profile. Every team member knows what the platform knows about them.

3. **No individual reporting.** Managers see aggregated and role-level data. They do not see individual performance data.

4. **Data isolation.** Team data stays within the restaurant. It is not shared across locations, across the network, or with third parties.

5. **Right to forget.** When an employee leaves, their personal data is removed. Only anonymized role patterns are retained.

---

# PART VIII — HEALTHY TEAM PRINCIPLES

---

## SECTION 12 — The Principles

Restaurant OS must encourage the following team qualities. Every team feature must be evaluated against these principles.

### Learning

The platform should help every team member get better at their job over time — not by tracking their improvement, but by making knowledge accessible when they need it.

- Recipe cards visible at the workstation
- Procedure guides available before a new task
- Training content organized by role, not by corporate hierarchy
- Learning is optional and self-directed

### Consistency

The platform should help the team deliver a consistent experience — not by enforcing standards, but by making the standard visible.

- Every team member sees the same 86'd list
- Every team member knows the current ticket time to communicate to customers
- Specs and procedures are a tap away, not locked in a binder

### Collaboration

The platform should make it easy for team members to support each other — without creating competition.

- Structured communication between roles (station needs → person who can help)
- Shift handoff that actually transfers knowledge
- Team-level view of readiness, not individual-level tracking

### Psychological Safety

The platform must never make a team member feel unsafe, embarrassed, or at risk.

- No mistakes are tracked
- No performance is measured
- No rankings exist
- No reports to management about individuals
- The platform is the employee's ally, not their supervisor's tool

### Recognition

The platform should make team members feel seen — not through gamification, but through honest acknowledgment.

- "The prep cook finished the list before service started. Every station was ready."
- Not "prep cook completed 120% of target."
- Acknowledgment is about outcomes, not metrics.

### Knowledge Sharing

The platform should help knowledge flow through the team — from veterans to newcomers, from one shift to the next.

- Structured shift notes that capture what was learned
- Role-specific tips that accumulate over time
- Easy way to document "how we do it here"

### Continuous Improvement

The platform should help the team get better over time — not by tracking their performance, but by tracking the systems they work within.

- When a problem recurs, the platform surfaces the pattern
- When a process works, the platform helps document it
- Improvement is about the system, not the people

---

# PART IX — ANTI-PATTERNS

---

## SECTION 13 — Never Create These

The following patterns are forbidden in Restaurant OS. They violate the Constitution, the Product Principles, and the fundamental principle of Team Intelligence.

### Employee Scoring

**What it is:** A score assigned to each employee based on performance metrics — speed, accuracy, attendance, customer feedback, or any combination.

**Why it is forbidden:** Scoring reduces a human being to a number. It creates stress, competition, and fear. It ignores context — a slow day may be caused by factors outside the employee's control. Scoring violates Article 25 (Never Manipulates) and Article 17 (Calm Over Anxiety).

**What Restaurant OS does instead:** No scores. No ratings. The platform evaluates systems and processes, not people.

### Fear

**What it is:** Any feature that makes an employee afraid — afraid of being caught, afraid of being compared, afraid of being fired.

**Why it is forbidden:** Fear destroys psychological safety. A fearful employee does not perform better — they perform more cautiously, hide mistakes, and avoid taking initiative. Fear violates Article 10 (People Before Algorithms) and Article 17 (Calm Over Anxiety).

**What Restaurant OS does instead:** The platform is the employee's ally. It exists to reduce uncertainty, not create it.

### Competition Between Coworkers

**What it is:** Features that rank employees against each other — leaderboards, speed rankings, sales contests, "employee of the month" metrics.

**Why it is forbidden:** Competition destroys collaboration. When employees are competing, they stop helping each other. The dishwashers race, the servers hide tips, the cooks stop covering for each other. The restaurant as a whole performs worse. Competition violates Article 10 (People Before Algorithms) — the system serves human judgment, it does not manipulate it.

**What Restaurant OS does instead:** The platform encourages collaboration. It surfaces team-level information that helps employees support each other.

### Dark Patterns

**What it is:** Interface designs that trick or manipulate employees into behavior that benefits the employer — accepting extra shifts, not taking breaks, skipping training.

**Why it is forbidden:** Dark patterns violate Article 25 (Never Manipulates) explicitly. They destroy trust permanently. An employee who discovers they were manipulated will never trust the platform again.

**What Restaurant OS does instead:** Every interaction is transparent. The employee's interest is the platform's primary concern. If a feature benefits the employer more than the employee, it does not exist.

### Manipulation

**What it is:** Any feature designed to change employee behavior through psychological pressure — guilt, urgency, social comparison, loss aversion.

**Why it is forbidden:** Manipulation is the opposite of partnership. It treats the employee as a behavior to be shaped, not as a person to be supported. Manipulation violates Article 25 (Never Manipulates) and every Product Principle about trust.

**What Restaurant OS does instead:** The platform presents information and respects the employee's autonomy. It does not try to change their behavior through pressure.

### Addictive Gamification

**What it is:** Points, badges, streaks, levels, rewards, and other game mechanics designed to create compulsive engagement with the platform.

**Why it is forbidden:** Addictive patterns treat the employee as a user to be hooked, not as a professional to be supported. They create engagement without value. They violate Product Principle 14 (No Empty Features) and Article 25 (Never Manipulates).

**What Restaurant OS does instead:** Recognition is factual and earned. "You closed the station early" not "You earned the Clean Station badge." The recognition is the outcome, not a manufactured reward.

### Vanity Rankings

**What it is:** Rankings that look meaningful but drive no productive behavior — most shifts worked, fastest ticket times, most customer compliments.

**Why it is forbidden:** Vanity rankings create competition for meaningless metrics. Employees optimize the metric instead of their work. The metric becomes the goal, and the actual goal (great service, good food) suffers.

**What Restaurant OS does instead:** No rankings. No comparisons. The platform measures team-level outcomes, never individual competition.

---

# PART X — THE TEAM LIFECYCLE

---

## SECTION 14 — How the Team Changes Over Time

A restaurant team is not static. People join, grow, struggle, leave. Restaurant OS must understand this lifecycle.

### Onboarding

The first weeks are the most vulnerable. The new employee is overwhelmed, uncertain, and likely to leave if unsupported.

**What the platform can do:**
- Provide a clear, role-specific "what to learn this week" path
- Give the trainer structured guidance for each session
- Surface common questions and answers for the new role
- Never track how fast the new employee is learning

### Growth

Over months, the employee becomes competent. They need less guidance and more autonomy.

**What the platform can do:**
- Reduce information density as the employee gains experience
- Surface advanced knowledge (cross-training, specializations)
- Document what the employee has learned (with their consent)
- Never create a "skill level" score

### Plateau

Every employee plateaus. They know their role well enough to be comfortable. Growth slows.

**What the platform can do:**
- Surface opportunities for growth without pressure
- Offer cross-training in other roles
- Share anonymous patterns from the network
- Never flag that an employee has plateaued to management

### Exit

When an employee leaves, the platform should handle the transition gracefully.

**What the platform can do:**
- Capture the departing employee's knowledge for the team
- Support the handoff to the next person
- Remove the employee's personal data after a reasonable period
- Never flag an employee as "flight risk"

---

# PART XI — DECISIONS, NOT WORKERS

---

## SECTION 15 — Every Role Answers One Question

Just as every screen in Restaurant OS answers one question, every role has one primary question that defines their work.

| Role | Primary Question |
| :--- | :--- |
| General Manager | "Is my shift ready?" |
| Shift Leader | "Is service running smoothly?" |
| Cashier | "Can I process this transaction quickly and correctly?" |
| Server | "What does my table need right now?" |
| Host | "Where should the next guest go?" |
| Line Cook | "What is the next ticket?" |
| Prep Cook | "Does the line have what it needs?" |
| Dishwasher | "Does every station have clean items?" |
| Delivery Driver | "Is every order delivered on time?" |
| Bartender | "What should I make next?" |
| Inventory Clerk | "Do we have everything we need?" |
| Cleaning Staff | "Is the restaurant clean and safe right now?" |

Every future team feature must be evaluated against the role's primary question. If a feature does not help the employee answer their primary question faster or more confidently, it does not belong.

---

# PART XII — CLOSING STATEMENT

---

Restaurant OS exists to help people make better decisions.

That includes the owner. That includes the manager. That includes the line cook, the cashier, the dishwasher, and every person who walks through the back door to serve customers.

This document defines how Restaurant OS understands work — not as a collection of tasks to be optimized, but as a network of human decisions, dependencies, and rhythms.

The team is not a resource to be managed.

The team is a group of humans trying to do their best work in a demanding, unpredictable, high-pressure environment.

Restaurant OS serves them by:

- Reducing uncertainty before every shift
- Providing information exactly when it is needed
- Surfacing dependencies before they become crises
- Never watching, never judging, never manipulating
- Remembering what helps and forgetting what hurts

Every future team feature must answer one question:

> **"Does this genuinely help this employee perform better today?"**

If the answer is no, the feature does not belong.

If the answer is yes, but the feature could also be used to monitor, judge, or punish, the feature must be redesigned until it cannot.

If the answer is yes, but a simpler version exists that would pass the same test, the simpler version must be built instead.

The platform is not a manager.

It is not a supervisor.

It is not a productivity tool.

It is a companion — always ready, always supportive, always on the employee's side.

---

*End of Research-002 — Work Model & Team Intelligence*
