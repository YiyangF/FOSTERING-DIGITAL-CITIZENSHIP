<template>
    <div class="support-app">
      <!-- FAQ Section with Bootstrap Accordion -->
      <section class="bg-light py-3 py-md-5">
        <div class="container">
          <div class="row gy-5 gy-lg-0 align-items-lg-center">
            <div class="col-12 col-lg-6">
              <img class="img-fluid rounded" loading="lazy" src="@/assets/faq_image.jpg" alt="Cyberbullying FAQs Illustration">
            </div>
            <div class="col-12 col-lg-6">
              <div class="row justify-content-xl-end">
                <div class="col-12 col-xl-11">
                  <h2 class="h1 mb-3">How can we help you?</h2>
                  <p class="lead fs-4 text-secondary mb-5">We hope you find answers to your questions. If you need further help, please search our Support Center or contact us via email.</p>
                  <div class="accordion accordion-flush" id="faqAccordion">
                    <div v-for="(faq, index) in faqs" :key="index" class="accordion-item">
                      <h2 class="accordion-header" :id="'heading' + index">
                        <button class="accordion-button" :class="{ collapsed: index !== 0 }" type="button"
                                data-bs-toggle="collapse" :data-bs-target="'#collapse' + index"
                                :aria-expanded="index === 0 ? 'true' : 'false'" :aria-controls="'collapse' + index">
                          {{ faq.question }}
                        </button>
                      </h2>
                      <div :id="'collapse' + index" class="accordion-collapse collapse" :class="{ show: index === 0 }"
                           :aria-labelledby="'heading' + index" data-bs-parent="#faqAccordion">
                        <div class="accordion-body">
                          <p>{{ faq.answer }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- <footer class="footer">
        <p>Need urgent help? Contact Kids Helpline Australia (1800 55 1800)</p>
      </footer> -->
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        faqs: [
          { question: "What is cyberbullying?", answer: "Cyberbullying is the use of digital technologies to harass, humiliate, or threaten someone. This includes messages, images, or content sent online or via mobile devices." },
          { question: "How can I tell if my child is being cyberbullied?", answer: "Watch for signs like sudden withdrawal, mood changes, reluctance to go to school, or secrecy around online activity." },
          { question: "What should I do if my child is being cyberbullied?", answer: "Stay calm, talk openly with your child, document evidence, report abuse to platforms, and escalate to the eSafety Commissioner if needed." },
          { question: "Can I report cyberbullying on behalf of my child?", answer: "Yes, you can report serious cases through the eSafety Commissioner’s website at esafety.gov.au." },
          { question: "What if my child is the one bullying others online?", answer: "Address it seriously. Teach empathy, set consequences, and guide them to understand the impact of their actions. Seek school or counseling support if needed." },
          { question: "How can I help prevent cyberbullying?", answer: "Encourage respectful online behavior, set rules for internet use, talk regularly, and lead by example." },
          { question: "What legal protections exist against cyberbullying in Australia?", answer: "The Online Safety Act 2021 empowers the eSafety Commissioner to act against serious online abuse and mandate takedowns." },
          { question: "How do I talk to my child about cyberbullying?", answer: "Use a calm and empathetic approach. Ask open-ended questions and reassure them they are not in trouble." },
          { question: "Is there an email to report cyberbullying?", answer: "General enquiries can be sent to enquiries@esafety.gov.au. For reports, use esafety.gov.au/report." },
          { question: "Who else can I contact besides eSafety?", answer: "You can also reach Kids Helpline, local schools, police, Headspace, Beyond Blue, and Legal Aid for additional support." }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  @import url('https://unpkg.com/bootstrap@5.3.3/dist/css/bootstrap.min.css');
      

    .support-app {
      font-family: 'Segoe UI', sans-serif;
      padding: 20px;
      background: url('@/assets/background_image.png') no-repeat center center fixed;
      background-size: cover;
      min-height: 100vh;
    }

    .support-app .container,
    .support-app .container > *,
    .support-app .bg-light,
    /* .support-app .accordion,
    .support-app .accordion-item,
    .support-app .accordion-button, */
    .support-app .accordion-body {
      background-color: transparent !important;
    }

    
    .support-app h2,
    .support-app p,
    .support-app .accordion-button {
      color: rgb(0, 0, 0);
      /* text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);  */
    }
  .footer {
    text-align: center;
    margin-top: 60px;
    color: #666;
    font-size: 0.9rem;
  }
  </style>
  