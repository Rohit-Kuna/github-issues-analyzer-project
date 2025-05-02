import dayjs from 'dayjs';

export const calculateWeeklyMetrics = (issues) => {
  const now = dayjs();
  const tenWeeksAgo = now.subtract(10, 'week');
  
  // Initialize weekly data structure
  const weeklyData = Array.from({ length: 10 }, (_, i) => {
    const weekStart = now.subtract(i, 'week').startOf('week');
    return {
      weekStart: weekStart.format('YYYY-MM-DD'),
      created: 0,
      closed: 0,
      closureRate: 0
    };
  }).reverse();

  // Process issues
  issues.forEach(issue => {
    const createdDate = dayjs(issue.created_at);
    const closedDate = issue.closed_at ? dayjs(issue.closed_at) : null;

    // Only process issues from the last 10 weeks
    if (createdDate.isAfter(tenWeeksAgo)) {
      const weekIndex = Math.floor(now.diff(createdDate, 'week'));
      if (weekIndex >= 0 && weekIndex < 10) {
        weeklyData[weekIndex].created++;
        
        if (closedDate && closedDate.isAfter(tenWeeksAgo)) {
          const closedWeekIndex = Math.floor(now.diff(closedDate, 'week'));
          if (closedWeekIndex >= 0 && closedWeekIndex < 10) {
            weeklyData[closedWeekIndex].closed++;
          }
        }
      }
    }
  });

  // Calculate closure rates
  weeklyData.forEach(week => {
    week.closureRate = week.created > 0 
      ? (week.closed / week.created) * 100 
      : 0;
  });

  return weeklyData;
};

export const calculateTotalMetrics = (issues) => {
  const totalCreated = issues.length;
  const totalClosed = issues.filter(issue => issue.closed_at).length;
  const averageClosureRate = totalCreated > 0 
    ? (totalClosed / totalCreated) * 100 
    : 0;

  return {
    totalCreated,
    totalClosed,
    averageClosureRate
  };
}; 