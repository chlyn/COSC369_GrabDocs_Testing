// ADD CHAT E2E TEST //

// SUCCESS SCENARIOS //
// Verifying that the user their new chat in the chat history 

describe('Success Scenarios', () => {

  // Logging in user before each test
  beforeEach(() => {

      cy.visit('https://app.grabdocs.com/upload');
      cy.login();

  });

  
  // it('message chat', () => {

  //   // Monitoring the backend API request and response
  //   cy.intercept('POST', '**/api/v1/web/chat/smart').as('messageChat');

  //   // Talking to chat
  //   cy.get('textarea[placeholder="Ask anything or send a message ... use @ to select users/workspaces/bookmarks.').type('hello');
  //   cy.get('button[title="Send message"]').click();

  //   // Verifying that the backend receives and responds correctly
  //   cy.wait('@messageChat').then(({request}) => {

  //     // Verifying the correct API endpoint and HTTP method was used for the request
  //     expect(request.url).to.include('/api/v1/web/chat/smart');
  //     expect(request.method).to.eq('POST');
  //     ecpect(request.body).to.include({
  //       message: 'hello'
  //     });

  //   });

  //   // Opening chat history
  //   cy.get('button[title="Show History"]').click();
  //   cy.contains(/Chat History/i).should('be.visible');

  // });

  it('add chat',  () => {

    // Monitoring the backend API request and response
    cy.intercept('POST', '**/api/v1/web/chat/new').as('addChat');

    // Adding a new chat by clicking "Start New Chat"
    cy.get('button[title="Start New Chat"]').click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@addChat').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/chat/new');
      expect(request.method).to.eq('POST');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body.chat_history).to.include({
        title: 'New Chat'
      });
      expect(response.body).to.include({
        success: true
      });

    })

    // Verifying that the user can see their new chat in the history 
    cy.get('button[title="Show History"]'). click();
    cy.contains('h4', /New Chat/i).should('be.visible');

  });

});
