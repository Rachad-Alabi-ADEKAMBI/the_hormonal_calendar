import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Info, Heart, Globe } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function HormomCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [cycleDuration, setCycleDuration] = React.useState('28')
  const [isEnglish, setIsEnglish] = useState(true)

  const calculateCyclePhases = (startDate: Date, duration: number) => {
    const phases = {
      menstruation: { start: new Date(startDate), end: new Date(startDate) },
      follicular: { start: new Date(startDate), end: new Date(startDate) },
      ovulation: { start: new Date(startDate), end: new Date(startDate) },
      luteal: { start: new Date(startDate), end: new Date(startDate) },
    }

    phases.menstruation.end.setDate(startDate.getDate() + 5)
    phases.follicular.start.setDate(startDate.getDate() + 6)
    phases.follicular.end.setDate(startDate.getDate() + 13)
    phases.ovulation.start.setDate(startDate.getDate() + 14)
    phases.ovulation.end.setDate(startDate.getDate() + 15)
    phases.luteal.start.setDate(startDate.getDate() + 16)
    phases.luteal.end.setDate(startDate.getDate() + duration - 1)

    return phases
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(isEnglish ? 'en-US' : 'fr-FR', { month: 'short', day: 'numeric' })
  }

  const cyclePhases = date ? calculateCyclePhases(date, parseInt(cycleDuration)) : null

  const getDayClass = (day: Date) => {
    if (!cyclePhases) return ''
    if (day >= cyclePhases.menstruation.start && day <= cyclePhases.menstruation.end) return 'bg-red-100 text-red-800 hover:bg-red-200'
    if (day >= cyclePhases.follicular.start && day <= cyclePhases.follicular.end) return 'bg-pink-100 text-pink-800 hover:bg-pink-200'
    if (day >= cyclePhases.ovulation.start && day <= cyclePhases.ovulation.end) return 'bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200'
    if (day >= cyclePhases.luteal.start && day <= cyclePhases.luteal.end) return 'bg-purple-100 text-purple-800 hover:bg-purple-200'
    return ''
  }

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-100 p-8 flex items-center justify-center">
      <Card className="max-w-5xl mx-auto shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 relative">
          <Button
            onClick={toggleLanguage}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
            size="icon"
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">{isEnglish ? 'Translate to French' : 'Traduire en anglais'}</span>
          </Button>
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-3 rounded-full shadow-md">
              <Heart className="h-10 w-10 text-pink-500" fill="currentColor" />
            </div>
            <div className="text-center">
              <CardTitle className="text-3xl font-bold">
                {isEnglish ? 'The Hormom Calendar' : 'Le Calendrier Hormom'}
              </CardTitle>
              <p className="text-xl font-light mt-1">
                {isEnglish ? 'Track, Predict, Understand' : 'Suivre, Prédire, Comprendre'}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-md bg-pink-50 border-pink-200">
                <CardContent className="p-4">
                  <p className="text-sm text-pink-800 leading-relaxed">
                    <strong>{isEnglish ? 'How to use The Hormom Calendar:' : 'Comment utiliser Le Calendrier Hormom :'}</strong>{' '}
                    {isEnglish
                      ? 'Select the first day of your last menstrual period on the calendar below and set your average cycle duration. We'll calculate and predict your future cycle phases, helping you understand your body's natural rhythm.'
                      : 'Sélectionnez le premier jour de vos dernières règles sur le calendrier ci-dessous et définissez la durée moyenne de votre cycle. Nous calculerons et prédirons les phases futures de votre cycle, vous aidant à comprendre le rythme naturel de votre corps.'}
                  </p>
                </CardContent>
              </Card>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-grow">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-xl border-2 border-pink-200 shadow-lg p-3 bg-white"
                    classNames={{
                      day_selected: "bg-pink-500 text-white hover:bg-pink-600 rounded-full",
                      day: (props) => `${getDayClass(props.date)} rounded-full`
                    }}
                  />
                </div>
                <div className="flex flex-col justify-center items-center space-y-4 bg-pink-50 p-6 rounded-xl border-2 border-pink-200">
                  <label htmlFor="cycle-duration" className="text-sm font-medium text-pink-700">
                    {isEnglish ? 'Cycle Duration' : 'Durée du Cycle'}
                  </label>
                  <Select value={cycleDuration} onValueChange={setCycleDuration}>
                    <SelectTrigger id="cycle-duration" className="w-[180px]">
                      <SelectValue placeholder={isEnglish ? 'Select cycle length' : 'Sélectionner la durée'} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 10}, (_, i) => i + 21).map(days => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} {isEnglish ? 'days' : 'jours'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {cyclePhases && (
                <Card className="shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-pink-800">
                      {isEnglish ? 'Your Cycle Prediction' : 'Prédiction de Votre Cycle'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <p className="text-sm font-medium text-red-800">{isEnglish ? 'Menstruation' : 'Menstruation'}</p>
                        <p className="text-xs text-red-600 mt-1">{formatDate(cyclePhases.menstruation.start)} - {formatDate(cyclePhases.menstruation.end)}</p>
                      </div>
                      <div className="bg-pink-100 p-3 rounded-lg">
                        <p className="text-sm font-medium text-pink-800">{isEnglish ? 'Follicular Phase' : 'Phase Folliculaire'}</p>
                        <p className="text-xs text-pink-600 mt-1">{formatDate(cyclePhases.follicular.start)} - {formatDate(cyclePhases.follicular.end)}</p>
                      </div>
                      <div className="bg-fuchsia-100 p-3 rounded-lg">
                        <p className="text-sm font-medium text-fuchsia-800">{isEnglish ? 'Ovulation' : 'Ovulation'}</p>
                        <p className="text-xs text-fuchsia-600 mt-1">{formatDate(cyclePhases.ovulation.start)} - {formatDate(cyclePhases.ovulation.end)}</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">{isEnglish ? 'Luteal Phase' : 'Phase Lutéale'}</p>
                        <p className="text-xs text-purple-600 mt-1">{formatDate(cyclePhases.luteal.start)} - {formatDate(cyclePhases.luteal.end)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="space-y-6">
              <Card className="shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-pink-800">
                    {isEnglish ? 'Cycle Legend' : 'Légende du Cycle'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center bg-red-100 p-2 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-red-400 mr-3"></div>
                      <span className="text-sm text-red-800">{isEnglish ? 'Menstruation' : 'Menstruation'}</span>
                    </div>
                    <div className="flex items-center bg-pink-100 p-2 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-pink-400 mr-3"></div>
                      <span className="text-sm text-pink-800">{isEnglish ? 'Follicular Phase' : 'Phase Folliculaire'}</span>
                    </div>
                    <div className="flex items-center bg-fuchsia-100 p-2 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-fuchsia-400 mr-3"></div>
                      <span className="text-sm text-fuchsia-800">{isEnglish ? 'Ovulation' : 'Ovulation'}</span>
                    </div>
                    <div className="flex items-center bg-purple-100 p-2 rounded-lg">
                      <div className="w-4 h-4 rounded-full bg-purple-400 mr-3"></div>
                      <span className="text-sm text-purple-800">{isEnglish ? 'Luteal Phase' : 'Phase Lutéale'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-pink-800">
                    {isEnglish ? 'How It Works' : 'Comment Ça Marche'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-pink-700 leading-relaxed">
                    {isEnglish
                      ? 'The Hormom Calendar uses your input to track and predict your menstrual cycle. By marking the start of your period and setting your average cycle duration, we calculate and display your cycle phases, helping you gain insights into your body's natural rhythm.'
                      : 'Le Calendrier Hormom utilise vos données pour suivre et prédire votre cycle menstruel. En marquant le début de vos règles et en définissant la durée moyenne de votre cycle, nous calculons et affichons les phases de votre cycle, vous aidant à mieux comprendre le rythme naturel de votre corps.'}
                  </p>
                  <Button className="mt-4 w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                    <Info className="mr-2 h-4 w-4" />
                    {isEnglish ? 'Learn More' : 'En Savoir Plus'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}