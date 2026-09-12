# 🎯 "Spot the AI" — Game Pack

**Format:** 8 rounds. Each round shows 2 items, **A** and **B**. One is human, one is AI.
**Voting:** Raised fingers — 1 finger = A is AI, 2 fingers = B is AI.
**Time per round:** 3 min (show, vote, reveal, discuss).
**Total:** 45 min including final debate.

> Facilitator: read out A first, then B. Pause. Then ask for vote *before* discussion.

---

## 🎲 ROUND 1 — Essay paragraph on the French Revolution

### A
> The French Revolution stands as one of the most pivotal turning points in modern history, fundamentally reshaping the political and social fabric of Europe. Sparked by widespread discontent with monarchical rule, economic inequality, and Enlightenment ideals, it ultimately dismantled centuries-old feudal structures and gave rise to new conceptions of citizenship, rights, and governance that continue to influence democratic societies today.

### B
> Most people think the Revolution started with the Bastille, but it really started in the bread queues. Paris was hungry. The king was hunting. The queen was buying ribbons. When the price of a loaf hit a labourer's daily wage, something had to give — and it did, loudly, in July of 1789.

**Answer:** **A is AI** (ChatGPT — note the "stands as", "fundamentally reshaping", "fabric of", "continue to influence" — classic LLM cadence).
**Talking point:** AI loves abstraction and grand sweep. Humans go *specific*.

---

## 🎲 ROUND 2 — Python function (find primes)

### A
```python
def get_primes(n):
    """Return all prime numbers up to n using the Sieve of Eratosthenes."""
    if n < 2:
        return []
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n + 1, i):
                is_prime[j] = False
    return [i for i, prime in enumerate(is_prime) if prime]
```

### B
```python
def primes(n):
    p = []
    for i in range(2, n+1):
        ok = 1
        for j in p:
            if j*j > i: break
            if i % j == 0: ok = 0; break
        if ok: p.append(i)
    return p
```

**Answer:** **A is AI** (clean docstring, edge case handling, idiomatic list comprehension, optimal algorithm — too polished).
**Talking point:** B has the fingerprints of a real coder — short names, semicolons, early break, no docstring. AI rarely writes "lazy" but working code.

---

## 🎲 ROUND 3 — Research paper abstract (Computer Vision)

### A
> We propose a novel attention-based framework for real-time object detection in low-light conditions. Our method leverages a dual-branch architecture that combines spectral enhancement with feature pyramid aggregation, achieving a 12.4% improvement in mAP over state-of-the-art baselines on the ExDark dataset while maintaining 47 FPS on a single RTX 3090.

### B
> We tried to detect cars at night. Existing models failed below 5 lux. We added a learnable gamma-correction layer before the YOLOv8 backbone — that's it. Surprisingly, this beat three more complicated 2024 papers on ExDark. We don't fully understand why. Code and weights are released.

**Answer:** **B is human** (honest, narrow claim, admits ignorance, simple method). **A is AI** (every conference-paper buzzword, suspiciously round metric improvement).
**Talking point:** AI mimics the *style* of papers without the *truth* of doing the work. Real researchers say "we don't fully understand why."

---

## 🎲 ROUND 4 — Poem about rain

### A
> The clouds descend in whispered grace,
> A gentle veil on time and space.
> Each silver drop, a fleeting sigh,
> Composes lullabies on high.

### B
> The drain on Mount Road is choking again.
> Auto-drivers raise the fare by twenty.
> My chappals float past me like small dark boats.
> Somewhere, a child is laughing.

**Answer:** **A is AI** (Hallmark-card abstraction, perfect rhyme, no specifics). **B is human** (real place, real smell, no rhyme, the laughing child).
**Talking point:** AI poetry is *pretty*. Human poetry is *true*. Show your students both.

---

## 🎲 ROUND 5 — Photo or AI image? (Portraits)

> *Show 2 portrait images side by side on slide. Suggested sources for facilitator to assemble before session:*
> - **A:** A real photo from Unsplash (search: "Indian student portrait")
> - **B:** An AI image from Ideogram with prompt: *"Photorealistic portrait of an Indian college student, natural lighting, candid"*

**Answer:** Mark whichever you generated.
**Telltale signs to point out:**
- Hands (extra/missing fingers, fused fingers)
- Earrings — often only one, or mismatched
- Background text — usually gibberish in AI
- Reflections in glasses / pupils — inconsistent in AI
- Skin texture — too perfect / too smooth in AI

---

## 🎲 ROUND 6 — Landscape (your campus / a fake)

> **A:** A real photo of your campus building (take one this week)
> **B:** AI-generated with prompt: *"A grand engineering college building in South India, photorealistic, golden hour"*

**Telltale signs:**
- Windows: AI often gets the count / alignment wrong
- Signboards: gibberish text
- Cars / two-wheelers: warped wheels
- Shadows: don't match the sun direction

**Talking point:** *"If your students submit a 'site visit photo' as part of an assignment — how would you know?"*

---

## 🎲 ROUND 7 — Student answer to a physics question

**Question:** *Explain why a heavier object and a lighter object fall at the same rate in vacuum.*

### A
> In a vacuum, there is no air resistance, so the only force acting on both objects is gravity. According to Newton's second law, F = ma, the acceleration of an object is the force divided by its mass. For a heavier object, the gravitational force is larger, but its mass is also larger by the same proportion, so the acceleration remains the same (g = 9.8 m/s²). Therefore, both objects accelerate equally and reach the ground at the same time.

### B
> Sir, gravity pulls both with same speed because air is not there. Heavy thing has more weight but also more mass so it cancels. So both fall together. Galileo proved this in tower.

**Answer:** **A is AI** (textbook-perfect English, full derivation, "Therefore"). **B is a real student** (broken English, "more weight but also more mass so it cancels" — the *concept* is right, the *language* isn't).
**Talking point:** This is the assessment trap. **A scores higher on language, B shows real understanding.** What are we actually grading?

---

## 🎲 ROUND 8 — Email to a parent

### A
> Dear Mr. Sharma,
>
> I hope this email finds you well. I am writing to bring to your attention some concerns regarding your son Rahul's recent academic performance. Over the past month, he has been absent from class on several occasions, and his performance in the recent unit test has shown a noticeable decline. I would greatly appreciate the opportunity to discuss this with you in person at your earliest convenience.
>
> Warm regards,
> [Name]

### B
> Mr. Sharma,
>
> Rahul has missed 6 classes this month and dropped from 78 to 54 in the last test. I'd like to meet — can you come this Friday between 3 and 5 PM? If that doesn't work, suggest a time.
>
> — Priya, Faculty CSE
> 98xxx-xxxxx

**Answer:** **A is AI** (formal, vague, no numbers, no time, "hope this email finds you well"). **B is human** (specific numbers, specific time slot, signed with phone — actionable).
**Talking point:** AI emails are *polite mush*. Good human emails are *specific*. Train AI by saying *"be specific — include numbers and a concrete next step."*

---

## 🏁 Final 10 Minutes — Open Debate

Ask the room:

1. **"Out of 8 rounds — how many did you get right?"** Show of hands: 8/8, 6-7, 4-5, less.
2. **"Where did your radar fail?"** Usually: code, research abstracts, formal essays.
3. **"If you can't tell — can your students?"** (They can't either.)
4. **"What does this mean for how we assess?"** Let them brainstorm. Capture on board.

### Suggested takeaway points (drop these if not raised):

- **AI is great at form, weaker at specifics.** Demand specifics in assessments.
- **Move the assessment goalpost** — viva, in-class writing, oral defence, process portfolios, "explain your code" interviews.
- **Don't ban AI — redesign the question.** Bad question (AI wins): *"Write an essay on the French Revolution."* Better question (human wins): *"Compare the French Revolution to the Indian freedom struggle through ONE common theme — explain in 200 words with examples we discussed in class."*
- **The arms race is fake.** No detector is 100% reliable. Redesign, don't detect.

---

## 🎒 Facilitator Setup Checklist

- [ ] 8 slides built (1 per round) — text rounds = side-by-side text; image rounds = side-by-side images
- [ ] Print this answer key for yourself (don't put it on slides!)
- [ ] Generate the 2 portrait images (Round 5) before the session
- [ ] Take 1 real campus photo + generate the fake one (Round 6)
- [ ] Test the dramatic reveal — animate the answer to appear on click
- [ ] Keep score on a whiteboard for fun, no individual scoring

---

## 💡 Extension idea (if room is electric)

**Round 9 — "Did *I* write this?"**

Pick 2 paragraphs from your *own* writing (paper, blog, email). Ask AI to write 2 similar paragraphs. Mix all 4. Faculty vote which 2 are yours.

Almost nobody gets it right. It's hilarious. And humbling.
