namespace App.Services
{
    public class R2Options
    {
        public string AccountId { get; set; } = string.Empty;
        public string AccessKeyId { get; set; } = string.Empty;
        public string SecretAccessKey { get; set; } = string.Empty;
        public string BucketName { get; set; } = string.Empty;

        public bool IsConfigured =>
            !string.IsNullOrWhiteSpace(AccountId)
            && !string.IsNullOrWhiteSpace(AccessKeyId)
            && !string.IsNullOrWhiteSpace(SecretAccessKey)
            && !string.IsNullOrWhiteSpace(BucketName);
    }
}
