export const getGoodTime = () => {
  const currentTime = new Date()

  const formattedTime = currentTime.toLocaleDateString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true // Ensures AM/PM format
  })

  const formattedDate = currentTime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return { formattedDate, formattedTime }
}