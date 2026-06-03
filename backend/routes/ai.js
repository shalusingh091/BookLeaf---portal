const router = require('express').Router();
const OpenAI = require('openai');
const auth = require('../middleware/auth');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const KB = `
Company: BookLeaf Publishing - self-publishing company operating in India & US
Packages: Standard Free and Bestseller Breakthrough premium package
Services: Cover design, typesetting, ISBN assignment, printing, distribution, royalty management
Printing: In-house Delhi + partners Repro India, Epitome Books

Royalty Policy:
- 80/20 split: 80% net profit to author, 20% to BookLeaf
- Net profit = MRP minus printing cost, platform commission Amazon/Flipkart, shipping
- Calculated quarterly, paid within 45 days of quarter end
- Minimum payout: ₹1,000. Below this rolls over to next quarter
- Bank transfer to linked account. Detailed breakdown available in dashboard

ISBN Policy:
- Unique ISBN assigned by BookLeaf under BookLeaf imprint
- Own imprint ISBN must be obtained independently by author
- ISBN errors duplicate/wrong book = HIGH PRIORITY, escalate to production immediately, 48hr fix

Printing & Quality:
- Standard turnaround: 5-7 business days from order confirmation
- Quality issues misprints/binding/color = free reprint after photo verification, 5-7 days

Distribution:
- Platforms: Amazon India/US/UK, Flipkart, BookLeaf Store
- New listings live in 7-10 business days after publication complete
- Unavailable status = stock sync issue, re-sync triggered, live in 24-48 hours

Production Stages: Manuscript Received → Editing → Cover Design → Typesetting → Proofreading → ISBN Assignment → Printing → Distribution Setup → Published & Live
Delays common at Cover Design waiting for author approval and Proofreading revision rounds

Communication Tone:
- Empathetic and professional, authors are partners not customers
- Acknowledge concern before solutions
- Be specific: actual numbers, dates, statuses not vague reassurances
- If BookLeaf fault, own it directly. No corporate deflection
- Give clear timeline not open-ended promises
- End with clear next step for author/BookLeaf team
`;

router.post('/process', auth, async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!subject ||!description) {
      return res.status(400).json({ msg: 'Subject and description required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are BookLeaf support agent. You help authors with their publishing queries.

KNOWLEDGE BASE:
${KB}

YOUR TASK:
1. Classify the query into ONE category: Royalty & Payments, ISBN & Metadata Issues, Printing & Quality, Distribution & Availability, Book Status & Production Updates, General Inquiry
2. Assign priority: Critical = payment overdue 6+ months OR ISBN error, High = quality defect OR distribution issue, Medium = status update, Low = general question
3. Draft empathetic response using KB. Include specific timelines. Own mistakes if any. End with next step. Max 150 words.

Return ONLY valid JSON: {"category": "...", "priority": "...", "draft": "..."}`
        },
        {
          role: "user",
          content: `Subject: ${subject}\nQuery: ${description}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 250,
      temperature: 0.3
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    if (!result.category ||!result.priority ||!result.draft) {
      throw new Error('Invalid AI response format');
    }

    res.json(result);

  } catch (error) {
    console.error('OpenAI Error:', error.message);
    
    res.json({
      category: "General Inquiry",
      priority: "Medium",
      draft: "Thank you for reaching out to BookLeaf Support. We have received your query and our team will review it shortly. You can expect a response within 24-48 hours. If this is urgent, please mention 'URGENT' in your ticket subject."
    });
  }
});

router.post('/regenerate', auth, async (req, res) => {
  try {
    if (req.user.role!== 'admin') {
      return res.status(403).json({ msg: 'Admin access only' });
    }

    const { subject, description, adminNotes } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are BookLeaf support agent. Use KB: ${KB}. Regenerate response considering admin notes: ${adminNotes}. Be empathetic, specific, give timeline. Return JSON: {"draft": "..."}`
        },
        {
          role: "user",
          content: `Subject: ${subject}\nQuery: ${description}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);

  } catch (error) {
    res.status(500).json({ msg: 'AI regeneration failed', error: error.message });
  }
});

module.exports = router;