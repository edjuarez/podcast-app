import { useNavigation } from 'react-router-dom'

export function NavigationIndicator() {
  const navigation = useNavigation()

  if (navigation.state === 'idle') {
    return null
  }

  return (
    <div className="h-5 w-5 animate-pulse rounded-full bg-[#4897CE]" />
  )
}