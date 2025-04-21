🧭 UI Enhancements
Routine Grouping by Time of Day
In the Daily Dashboard, routines should be grouped visually under time-of-day anchors: Morning, Afternoon, and Evening. This improves orientation and mental load—users can quickly locate what's relevant based on the current moment. Grouping is determined by each routine's preferred time.

"Next Up" Smart Cue
Highlight the next routine relative to the current time window. The card should show a subtle “Next Up” badge or slight background highlight. Logic: pick the earliest preferred time among unstarted routines after the current time.

Tag Iconography and Color Codes
In place of plain text tags, use small visual icons or color chips for faster scanning. For example:

💧 for hydration

🧴 for skincare

☀️ for morning This should be done at the tag-rendering level only—no new schema fields needed.

📱Routine Runner Improvements
Intention Reveal
If a step includes an intention, show a minimal "Why?" link or button. Tapping reveals a bottom sheet or small pop-up with the intention text. This feature helps reinforce mindful engagement without disrupting flow.

Duration and Completion Clarity
If a step has a duration, it is shown beneath the step text (already implemented). Add a final "Mark as Completed" screen with a single clear button to end the routine explicitly. This avoids confusion between completing the last step vs. exiting early.

🗓 Weekly View Improvements
Grid with Time and Routine Rows
Display a 7-column grid (Mon–Sun) with routine names as rows. Cells should indicate whether the routine is scheduled (e.g., shaded background) and whether it was completed that day (e.g., checkmark or dot). No extra schema fields are needed—derive from trigger.days.

