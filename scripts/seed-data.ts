import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const userEmail = 'kirkish.2@gmail.com'
  
  // Get the user
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  })

  if (!user) {
    console.log('User not found')
    return
  }

  const dummyData = [
    {
      date: new Date('2024-02-26'),
      weight: 82.5,
      breakfast: "Oatmeal with berries and honey, Green tea",
      morningSnack: "Apple and almonds",
      lunch: "Grilled chicken salad with avocado",
      afternoonSnack: "Greek yogurt with granola",
      dinner: "Baked salmon with quinoa and roasted vegetables",
      workoutActivity: "30 min cardio, 20 min strength training",
      waterIntake: 2.5,
      notes: "Feeling energetic today, good workout session"
    },
    {
      date: new Date('2024-02-25'),
      weight: 83.0,
      breakfast: "Scrambled eggs with whole grain toast",
      morningSnack: "Banana and protein shake",
      lunch: "Turkey wrap with vegetables",
      afternoonSnack: "Carrot sticks with hummus",
      dinner: "Lean beef stir-fry with brown rice",
      workoutActivity: "45 min yoga session",
      waterIntake: 2.0,
      notes: "Focused on stretching and flexibility today"
    },
    {
      date: new Date('2024-02-24'),
      weight: 83.2,
      breakfast: "Protein smoothie with spinach and banana",
      morningSnack: "Mixed nuts and dried fruits",
      lunch: "Tuna salad sandwich",
      afternoonSnack: "Celery with peanut butter",
      dinner: "Grilled chicken breast with sweet potato",
      workoutActivity: "1 hour swimming",
      waterIntake: 3.0,
      notes: "Great swimming session, feeling motivated"
    },
    {
      date: new Date('2024-02-23'),
      weight: 83.5,
      breakfast: "Greek yogurt parfait with granola",
      morningSnack: "Orange and handful of almonds",
      lunch: "Quinoa bowl with chickpeas",
      afternoonSnack: "Protein bar",
      dinner: "Vegetable stir-fry with tofu",
      workoutActivity: "40 min cycling, 20 min weights",
      waterIntake: 2.8,
      notes: "Trying to increase protein intake"
    },
    {
      date: new Date('2024-02-22'),
      weight: 83.8,
      breakfast: "Whole grain pancakes with fruit",
      morningSnack: "Smoothie",
      lunch: "Mediterranean salad with feta",
      afternoonSnack: "Rice cakes with avocado",
      dinner: "Grilled fish with roasted vegetables",
      workoutActivity: "1 hour hiking",
      waterIntake: 2.2,
      notes: "Beautiful day for outdoor activity"
    }
  ]

  for (const data of dummyData) {
    // Create weight entry
    await prisma.weight.create({
      data: {
        weight: data.weight,
        date: data.date,
        userId: user.id
      }
    })

    // Create daily log entry
    await prisma.dailyLog.create({
      data: {
        date: data.date,
        breakfast: data.breakfast,
        morningSnack: data.morningSnack,
        lunch: data.lunch,
        afternoonSnack: data.afternoonSnack,
        dinner: data.dinner,
        workoutActivity: data.workoutActivity,
        waterIntake: data.waterIntake,
        notes: data.notes,
        userId: user.id
      }
    })
  }

  console.log('Dummy data created successfully')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 