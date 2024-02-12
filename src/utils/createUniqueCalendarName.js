export default function createUniqueCalendarName(currentCalendarName, allCalendarNames) {
  let uniqueName = currentCalendarName;
  let number = 1;

  while (allCalendarNames.includes(uniqueName)) {
    uniqueName = `${currentCalendarName} (${number})`;
    number++;
  }
  return uniqueName;
}
