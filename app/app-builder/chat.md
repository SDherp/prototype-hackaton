# Build AI Dev Assistant Chatbot with Context Awareness & Caching

Build the chatbot now that lets users modify this app through natural language prompts. The chatbot must understand the existing codebase and use Claude's prompt caching to minimize token costs.


## Core Requirements

### 1. Project Context System
Create `lib/project-context.ts` with helper functions:
- `generateFileTree()` - Recursively scan app/ directory, skip node_modules/.git/.next/.versions
- `findRelevantFiles(prompt)` - Keyword-based search, return top 8 relevant files
- `readFileContent(path)` - Read file, skip if >100KB
- `getProjectDependencies()` - Parse package.json dependencies
- `getKeyFiles()` - Always include: globals.css, tailwind.config.ts, tsconfig.json, lib/utils.ts
- `isPathSafe(path)` - Validate paths (allow: app/, components/, lib/, hooks/ | block: .env, package.json, next.config.js)



**Context Building**:
```typescript
// Before calling Claude, gather:
const context = {
  fileTree: await generateFileTree(),
  relevantFiles: await findRelevantFiles(userPrompt),
  keyFiles: await getKeyFiles(),
  dependencies: await getProjectDependencies()
}
```

**Claude API Call with Caching**:
```typescript
await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 4096,
  system: [
    { type: 'text', text: BASE_SYSTEM_PROMPT },
    { 
      type: 'text', 
      text: formattedProjectContext,
      cache_control: { type: 'ephemeral' }  // CACHE THIS!
    }
  ],
  messages: conversationMessages
})
```

**System Prompt Structure**:
- "You are an expert Next.js developer assistant"
- "You have full visibility of project structure and existing files (provided below)"
- "When modifying existing files, preserve structure"
- "Always provide COMPLETE file contents, never snippets"
- "Response format: JSON only with {message, files: {path: content}}"
- Then append: PROJECT STRUCTURE + DEPENDENCIES + EXISTING FILES

**Response Handling**:
- Extract JSON from Claude's response
- Validate all file paths with `isPathSafe()`
- Write files to disk using fs.promises
- Save version snapshot to `.versions/`
- Run TypeScript check: `npx tsc --noEmit --skipLibCheck`
- Return: {message, changes[], errors?, cacheStats}

**Safety**:

- Validate all paths before writing
- Log cache usage: `response.usage.cache_read_input_tokens`

### 3. Version Management APIs

**GET /api/versions**:
- Read all .json files from `.versions/`
- Read current version from `.versions/current.txt`
- Return sorted by timestamp

**POST /api/rollback**:
- Read version file by ID
- Validate all paths
- Restore all files from that version
- Update current.txt pointer

### 4. Chat UI Component
Create `app/components/DevChatbot.tsx`:

**Layout**:
```
<div className="flex h-screen bg-background text-foreground">
  <div className="flex-1 flex flex-col">
    {/* Header: bg-card border-b border-border */}
    {/* Messages: user=bg-primary, assistant=bg-muted, system=bg-card italic */}
    {/* Input: bg-card border-t, input=bg-input, button=bg-primary */}
  </div>
  <div className="w-80 bg-card border-l border-border">
    {/* Versions sidebar with rollback buttons */}
  </div>
</div>
```

**Features**:
- Message history with timestamps
- Loading state (bouncing dots)
- Auto-scroll to latest message
- System messages for: changes applied, errors, rollbacks
- Version list with current indicator
- Rollback confirmation dialog

### 5. Page
Create `app/dev-assistant/page.tsx` that renders `<DevChatbot />`

## File Structure to Create
```
lib/project-context.ts
app/api/chat/route.ts
app/api/versions/route.ts
app/api/rollback/route.ts
app/components/DevChatbot.tsx
app/dev-assistant/page.tsx
```

## Setup
- Install: `@anthropic-ai/sdk`
- .env.local: `ANTHROPIC_API_KEY=...`
- .gitignore: `.versions/`

## Key Implementation Hints

**Caching reduces costs by 90%**:
- First request: Full context sent (~5K tokens)
- Subsequent requests: Context read from cache (90% discount)
- Cache lasts 5 minutes of inactivity

**Context gathering flow**:
1. User sends: "Add validation to login form"
2. System finds: app/components/LoginForm.tsx
3. Reads: LoginForm.tsx + globals.css + relevant files
4. Sends to Claude: "Here's the project... here's LoginForm... now add validation"
5. Claude: Modifies existing file intelligently
6. System: Writes file → Next.js reloads → Done

**Safety validation example**:
```typescript
if (!filePath.startsWith('app/') && !filePath.startsWith('components/')) throw Error
if (filePath.includes('..')) throw Error
if (filePath.endsWith('package.json')) throw Error
```

**Design system**: Use ONLY these tokens from existing CSS:
- bg-background, bg-card, bg-muted, bg-primary, bg-secondary
- text-foreground, text-muted-foreground, text-primary-foreground
- border-border, bg-input, focus:ring-ring

---

Build this complete system now. Create all files, implement context gathering, enable caching, add safety checks, and match the existing design system.