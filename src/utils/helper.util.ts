import { SelectOption } from "@/components/Select"
import { Timestamp } from "firebase/firestore"

const weekdayNormalizer = (day: string, length: 'long' | 'short' = 'long') => {
  return new Date(day).toLocaleDateString('en-US', { weekday: length ?? 'short' })
}

const readableDateFormatter = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const dateFormatter = (date: Date) => {
  return date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

const monthFormatter = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
}

const timestampToDateConverter = (date: Timestamp) => {
  const timestamp = new Timestamp(date.seconds, date.nanoseconds);
  return timestamp.toDate();
}

const graphDataLabelFormatter = (label: string) => {
  const formattedDate = label.split('-').reverse().join('-')
  if (new Date(formattedDate).toString() != 'Invalid Date') {
    return new Date(label.split('-').reverse().join('-')).toDateString();
  }
  if (new Date(label).toString() == 'Invalid Date') {
    return label;
  } else {
    return new Date(label).toDateString();
  }
}

const dateToMillisecondsConverter = (date: string) => {
  return new Date(date).getTime();
}

const dateToTimestampConverter = (date: string) => {
  return Timestamp.fromDate(new Date(date))
}

const randomColorGenerator = (number: number) => {
  const generateGreenColor = () => {
    const red = Math.floor(Math.random() * 128);
    const blue = Math.floor(Math.random() * 128);
    const green = Math.floor(Math.random() * 128) + 128;
    const colorCode = `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;

    return colorCode;
  }

  if (!number || number == 1) {
    return generateGreenColor();
  }

  const colors = [];
  for (let i = 0; i < number; i++) {
    colors.push(generateGreenColor());
  }
  return colors;
}

const stampToDate = (stamp: any) => {
  if (!stamp) return new Date(1970, 0, 1);
  let date;
  if (stamp.toDate && typeof stamp.toDate == "function") date = stamp.toDate();
  else {
    date = new Date(1970, 0, 1);
    if (stamp.seconds) date.setSeconds(stamp.seconds);
    else if (stamp._seconds) date.setSeconds(stamp._seconds);
  }
  return date;
};

const transformToSelectOptions = (values: Array<string> | Array<any>, labels?: Array<string>) => {
  if (!labels) {
    return values.map((value) => {
      if (typeof value == 'object') {
        return ({ key: value['id'], value: value['name'] }) as SelectOption
      }
      return ({ key: value, value }) as SelectOption
    })
  } else {
    return values.map((key, index) => ({ key, value: labels[index] }) as SelectOption)
  }
}

const currencyConverter = (amount: number) => {
  return `₦${Number(amount).toLocaleString()}`
}

const normalizeCamelCase = (text: string) => {
  const words = text.replace(/([A-Z][a-z]+)/g, ' $1').trim().split(/\s+/);
  const formattedText = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return formattedText;
}

const generateRandomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

const extendUID = (uid: string) => {
  const longform = uid + uid;
  return longform.substring(0, 32)
}

export default { weekdayNormalizer, readableDateFormatter, dateFormatter, monthFormatter, timestampToDateConverter, graphDataLabelFormatter, dateToMillisecondsConverter, dateToTimestampConverter, randomColorGenerator, stampToDate, transformToSelectOptions, currencyConverter, normalizeCamelCase, generateRandomHexColor, extendUID }