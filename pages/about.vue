<template>
  <!-- TODO Use a bootstrap container here rather than spacer columns -->
  <!-- TODO Rework to use the FAQ accordion, as in Help page -->
  <b-col>
    <b-row class="m-0">
      <b-col cols="0" md="3" />
      <b-col cols="12" md="6">
        <h1 class="text-center">
          About Us
        </h1>
        <p class="text-left">
          Please click on a section to find out more.
        </p>
        <!-- TODO Make these cards into a component -->
        <div role="tablist">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button v-b-toggle.accordion-what block href="#" variant="default">
                What Do We Do?
              </b-button>
            </b-card-header>
            <b-collapse id="accordion-what" accordion="about-us-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text>
                  <p>Do your unwanted but useful items need new homes? Are you looking for something?</p>
                  <p>We help people give and get things for free in their local community. Some people have stuff they don't want any more. Other people would like things they don't have. We match them up. We don't have physical premises, or warehouses - people give things directly to each other.</p>
                  <p><em>Don't throw it away, give it away!</em></p>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button v-b-toggle.accordion-how block href="#" variant="default">
                How Does It Work?
              </b-button>
            </b-card-header>
            <b-collapse id="accordion-how" accordion="about-us-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text>
                  <p>It's simple.</p>
                  <ul>
                    <li>Post a message offering an item.</li>
                    <li>Other people see it and reply to you.</li>
                    <li>Choose who to give it to and they collect.</li>
                    <li>You've decluttered, made someone's day and saved an item from landfill.</li>
                  </ul>
                  <p>That's freegling! And it's all free.</p>
                  <p>You can also search or browse the items offered, or post a request for something that other people might have.</p>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button v-b-toggle.accordion-who block href="#" variant="default">
                Who Are We?
              </b-button>
            </b-card-header>
            <b-collapse id="accordion-who" accordion="about-us-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text>
                  <h2>We Love Volunteers!</h2>
                  <p>Freegle is run by volunteers. Here are some of us:</p>

                  <b-list-group horizontal class="mb-1 mt-2 flex flex-wrap">
                    <b-list-group-item v-for="volunteer in volunteers" :key="'volunteering-' + volunteer.id" class="bg-transparent p-0">
                      <b-img-lazy
                        v-if="!volunteer.profile.default"
                        class="profile"
                        rounded="circle"
                        :title="volunteer.displayname"
                        :src="volunteer.profile.turl"
                        @error.native="brokenImage"
                      />
                    </b-list-group-item>
                  </b-list-group>

                  <h2>Our Board</h2>
                  <p>Our volunteers elect a Board.  Here they are:</p>
                  <div v-for="boardmember in board" :key="'board-' + boardmember.id" class="bg-transparent p-0">
                    <div class="media clickme">
                      <div class="media-left">
                        <div class="media-object">
                          <b-img-lazy
                            v-if="!boardmember.profile.default"
                            class="profile mr-2"
                            rounded="circle"
                            :title="boardmember.displayname"
                            :src="boardmember.profile.turl"
                            @error.native="brokenImage"
                          />
                        </div>
                      </div>
                      <div class="media-body">
                        <b>{{ boardmember.displayname }}</b>
                        <p v-if="boardmember.description">
                          {{ boardmember.description }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h2>Why We Do It</h2>
                  <p>People have different reasons! Common reasons are:</p>
                  <ul>
                    <li>Many of us are passionate about the environment - and reuse means we make and destroy less stuff.</li>
                    <li>We like helping people get things they need, which they otherwise couldn't get.</li>
                    <li>We care about our local communities, and this is a way to make them better.</li>
                  </ul>
                  <h2>Get Involved!</h2>
                  <p>We're always looking for more volunteers - for local communities, graphics, publicity, improving the website...there's lots to do.</p>
                  <p>
                    If you'd like to get involved, <nuxt-link to="/contact">
                      contact your local community.
                    </nuxt-link>
                  </p>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button v-b-toggle.accordion-funding block href="#" variant="default">
                How Is It Funded?
              </b-button>
            </b-card-header>
            <b-collapse id="accordion-funding" accordion="about-us-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text>
                  <p>
                    <strong>Freegle is free to use, but not free to run.</strong>  We provide a free service, and keep costs
                    <em>phenomenally</em> low thanks to our
                    large number of committed volunteers - <strong>our annual budget averages just £40,000 each year</strong>.
                    You can see our accounts <a target="_blank" href="https://freegle.in/Accounts">here</a>.
                  </p>
                  <p>
                    Nevertheless, there are still costs involved, and if we had more money we could get more people freegling more
                    often.  We run on a shoestring...actually, we're saving up to buy a shoestring.
                  </p>
                  <p>
                    There are lots of good causes out there, many of them for life-threatening conditions, all of them competing
                    for charity funding.  It usually goes to bigger charities than us doing more important work, so we currently rely on
                    voluntary donations to cover our costs.  You can donate <nuxt-link to="/donate">
                      here.
                    </nuxt-link>
                  </p>
                  <p>
                    Many current donations come from our volunteers, who are already donating their time and may not be able to
                    donate money as well.  If you can, <b>please donate £3</b> to keep us running - but anything you can give is very welcome.
                    Regular monthly donations are especially helpful.
                  </p>
                  <p>
                    We also have ads on the site and in emails.  It doesn't raise as much as you'd think, but it helps
                    keep us running.
                  </p>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button v-b-toggle.accordion-legal block href="#" variant="default">
                What's Our Legal Structure
              </b-button>
            </b-card-header>
            <b-collapse id="accordion-legal" accordion="about-us-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text>
                  <p>
                    Freegle is a UK-wide umbrella organisation, formed in 2009 by experienced volunteers and members of the
                    free reuse community.  We are a charity, and our charitable aims are:
                  </p>
                  <ul>
                    <li>Promoting the keeping of usable items out of landfill.</li>
                    <li>Promoting and supporting local community groups working in the area of reuse.</li>
                    <li>Empowering and supporting volunteers working for local Freegle groups.</li>
                    <li>Informing and educating the public about environmental matters related to the reuse and recycling of unwanted usable goods.</li>
                    <li>Promoting sustainable waste management practices.</li>
                  </ul>
                  <p>
                    Each Freegle local group is run independently and is affiliated to Freegle Ltd, which provides central
                    services (such as this website) to these groups and their volunteers. Freegle Ltd is an Industrial and Provident Society for Community
                    Benefit.  Freegle Ltd is owned and governed by its members.  Local and national volunteers are eligible for membership.
                  </p>
                  <p>
                    Charities of this type are slightly unusual in that they do not register with the Charity Commission (see <a href="https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/586603/Industrial_and_provident_societies.pdf" target="_blank" rel="noopener">here</a>).
                    Instead they register with the Financial Conduct Authority (our registration number is <a href="https://mutuals.fca.org.uk/Search/Society/9593" target="_blank" rel="noopener">32410R</a>)
                    and also register with HMRC as charitable (our reference is XT32865).  So we're legally a charity, but of a slightly
                    different type than you might be used to.
                  </p>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-button v-b-toggle.accordion-questions block href="#" variant="default">
                Got questions?
              </b-button>
            </b-card-header>
            <b-collapse id="accordion-questions" accordion="about-us-accordion" role="tabpanel">
              <b-card-body>
                <b-card-text>
                  <p>
                    If you have questions, please <nuxt-link to="/contact">
                      contact us.
                    </nuxt-link>
                  </p>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </b-col>
      <b-col cols="0" md="3" />
    </b-row>
  </b-col>
</template>
<script>
export default {
  computed: {},
  async asyncData({ app, params, store }) {
    await store.dispatch('team/fetch', {
      name: 'Volunteers'
    })

    const volunteers = store.getters['team/get']()

    await store.dispatch('team/clear')

    await store.dispatch('team/fetch', {
      name: 'Board'
    })

    const board = store.getters['team/get']()
    console.log('BOard', board)

    return {
      board: board.members,
      volunteers: volunteers.members
    }
  },
  methods: {
    brokenImage(event) {
      console.error('Broken profile image', event.target.src)
      event.target.src = '/static/defaultprofile.png'
    }
  }
}
</script>
